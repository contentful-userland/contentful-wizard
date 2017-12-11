import { fetch, IEntity } from "./fetch";
import { clients } from "./init";
import { getContentTypeNodes, getCTEntryNodes } from "./state";
import { animate, renderOverlay, applyStyle, createElement } from "./utils";
import {
  onHover,
  constructSpaceURL,
  constructContentTypeURL,
  constructEntryURL
} from "./utils";
import { createClient } from "contentful";

export function showPopup({
  node,
  spaceId,
  contentType,
  entry,
  cleanup
}: {
  node: HTMLElement;
  spaceId: string;
  contentType: string;
  entry: string;
  cleanup: Function;
}) {
  const { top, left, right } = node.getBoundingClientRect();
  const offsetY = window.pageYOffset;

  const tooltip: HTMLElement = createElement({
    style: {
      position: "absolute",
      background: "#fff",
      zIndex: "999",
      minWidth: "150px",
      maxWidth: "350px",
      padding: "15px",
      left: `${right - 5}px`,
      top: `${offsetY + top + 30}px`,
      border: "2px solid #ccc",
      borderRadius: "5px",
      opacity: "0"
    },
    text: "loading..."
  });

  const { promise, cleanup: cleanupContent } = fetchContent({
    spaceId,
    contentType,
    entry
  });

  promise.then(content => {
    if (content) {
      tooltip.innerHTML = "";
      tooltip.appendChild(content);
    }
  });

  document.body.appendChild(tooltip);

  animate({
    node: tooltip,
    start: 0,
    stop: 1
  });

  const cleanupHover = onHover({
    node: tooltip,
    onMouseLeave: (e: MouseEvent) => {
      if (e.relatedTarget !== node) {
        cleanup();
      }
    }
  });

  return {
    node: tooltip,
    destroy: async () => {
      try {
        await animate({
          node: tooltip,
          start: 1,
          stop: 0
        });
        cleanupContent();
        cleanupHover();
        document.body.removeChild(tooltip);
      } catch (e) {
        console.log("error during removing tooltip::", e);
      }
    }
  };
}

function fetchContent({
  spaceId,
  contentType,
  entry
}: {
  spaceId: string;
  contentType: string;
  entry: string;
}) {
  let closed = false;
  const client = clients[spaceId];
  const cleanupFns: Function[] = [];
  const promise = fetch({ client, contentType, entry }).then(
    ({ contentTypesData, entriesData }) => {
      if (!closed) {
        const container = document.createElement("div");
        const { node: ctsContainer, cleanup: ctsCleanup } = renderContentTypes({
          contentTypesData,
          spaceId
        });
        const {
          node: entriesContainer,
          cleanup: entriesCleanup
        } = renderEntries({
          contentTypesData,
          contentType,
          spaceId,
          entriesData
        });
        cleanupFns.push(ctsCleanup, entriesCleanup);

        const spaceURL = constructSpaceURL({ spaceId });
        const contentTypeURL = constructContentTypeURL({
          spaceId,
          contentType
        });
        const entryURL = constructEntryURL({ spaceId, entry });
        const spaceLink = renderLink({ href: spaceURL, text: "Link to space" });
        const ctLink = renderLink({
          href: contentTypeURL,
          text: "Link to content type"
        });
        const entryLink = renderLink({ href: entryURL, text: "Link to entry" });

        container.appendChild(spaceLink);
        container.appendChild(ctLink);
        container.appendChild(entryLink);

        container.appendChild(ctsContainer);
        container.appendChild(entriesContainer);

        return container;
      }
    }
  );

  return {
    promise,
    cleanup: () => {
      closed = true;
      cleanupFns.forEach(fn => fn());
    }
  };
}

function renderLink({ text, href }: { text: string; href: string }) {
  return createElement({
    tag: "a",
    attrs: {
      href,
      target: "_blank"
    },
    text,
    style: {
      textDecoration: "underline",
      color: "blue",
      display: "block"
    }
  });
}

function renderContentTypes({
  contentTypesData,
  spaceId
}: {
  contentTypesData: { [key: string]: any };
  spaceId: string;
}) {
  const ctsContainer = document.createElement("div");
  const line = createElement({
    style: {
      height: "1px",
      margin: "10px 0",
      background: "#ccc"
    }
  });
  const header = createElement({
    tag: "h3",
    text: "Content types on the page:",
    style: {
      marginTop: "0",
      marginBottom: "10px"
    }
  });

  ctsContainer.appendChild(line);
  ctsContainer.appendChild(header);
  const cleanupFns: Function[] = [];
  const contentTypeNodes = getContentTypeNodes();
  Object.keys(contentTypeNodes)
    .map(key => ({ nodes: contentTypeNodes[key], data: contentTypesData[key] }))
    .forEach(({ nodes = [], data }: { data: IEntity; nodes: any[] }) => {
      const element = document.createElement("div");
      const link = constructContentTypeURL({
        spaceId,
        contentType: data.sys.id
      });

      const linkNode = createElement({
        tag: "a",
        attrs: {
          href: link,
          target: "_blank"
        },
        text: data.name || "No name property!",
        style: {
          display: "inline-block",
          borderBottom: "1px dashed #ccc",
          paddingBottom: "2px",
          marginBottom: "5px"
        }
      });

      let overlays: Function[] = [];

      const cleanup = onHover({
        node: linkNode,
        onMouseEnter: () => {
          nodes.forEach(node => {
            overlays.push(renderOverlay({ node }));
          });
        },
        onMouseLeave: cleanOverlays
      });

      cleanupFns.push(() => {
        cleanOverlays();
        cleanup();
      });

      element.appendChild(linkNode);
      ctsContainer.appendChild(element);

      function cleanOverlays() {
        overlays.forEach(fn => fn());
        overlays = [];
      }
    });

  return {
    node: ctsContainer,
    cleanup: () => {
      cleanupFns.forEach(fn => fn());
    }
  };
}

function renderEntries({
  contentTypesData,
  entriesData,
  spaceId,
  contentType
}: {
  contentTypesData: { [key: string]: any };
  entriesData: { [key: string]: any };
  spaceId: string;
  contentType: string;
}) {
  const contentTypeData = contentTypesData[contentType];
  const ctsContainer = document.createElement("div");
  const line = createElement({
    style: {
      height: "1px",
      margin: "10px 0",
      background: "#ccc"
    }
  });
  const header = createElement({
    tag: "h3",
    text: `${contentTypeData.name} entries:`,
    style: {
      marginTop: "0",
      marginBottom: "10px"
    }
  });

  ctsContainer.appendChild(line);
  ctsContainer.appendChild(header);
  const cleanupFns: Function[] = [];

  const entries = getCTEntryNodes({ contentType });

  Object.keys(entries)
    .map(entryId => ({
      entry: entryId,
      nodes: entries[entryId],
      data: entriesData[entryId]
    }))
    .forEach(({ entry, nodes }) => {
      const element = document.createElement("div");
      const link = constructEntryURL({
        spaceId,
        entry
      });

      const linkNode = createElement({
        tag: "a",
        attrs: {
          href: link,
          target: "_blank"
        },
        text: entry,
        style: {
          display: "inline-block",
          borderBottom: "1px dashed #ccc",
          paddingBottom: "2px",
          marginBottom: "5px"
        }
      });

      let overlays: Function[] = [];

      const cleanup = onHover({
        node: linkNode,
        onMouseEnter: () => {
          nodes.forEach(node => {
            overlays.push(renderOverlay({ node }));
          });
        },
        onMouseLeave: cleanOverlays
      });

      cleanupFns.push(() => {
        cleanOverlays();
        cleanup();
      });

      element.appendChild(linkNode);
      ctsContainer.appendChild(element);

      function cleanOverlays() {
        overlays.forEach(fn => fn());
        overlays = [];
      }
    });

  return {
    node: ctsContainer,
    cleanup: () => {
      cleanupFns.forEach(fn => fn());
    }
  };
}
