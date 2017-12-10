import { fetch, IEntity } from "./fetch";
import { clients } from "./init";
import { contentTypes, entries } from "./state";
import { animate, renderOverlay, applyStyle } from "./utils";
import {
  onHover,
  constructSpaceURL,
  constructContentTypeURL,
  constructEntryURL
} from "./utils";

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

  const tooltip: HTMLElement = document.createElement("div");
  applyStyle({
    node: tooltip,
    style: {
      position: "absolute",
      background: "#fff",
      zIndex: "999",
      minWidth: "150px",
      maxWidth: "350px",
      padding: "15px",
      left: `${right - 5}px`,
      top: `${top + 30}px`,
      border: "1px solid #ccc",
      borderRadius: "3px",
      opacity: "0"
    }
  });

  tooltip.innerHTML = "loading...";

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
    ({ contentTypesData }) => {
      if (!closed) {
        const container = document.createElement("div");
        const { node: ctsContainer, cleanup } = renderContentTypes({
          contentTypesData,
          spaceId
        });
        cleanupFns.push(cleanup);

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
  const link = document.createElement("a");
  link.setAttribute("href", href);
  link.setAttribute("target", "_blank");
  link.innerHTML = text;

  applyStyle({
    node: link,
    style: {
      textDecoration: "underline",
      color: "blue",
      display: "block"
    }
  });

  return link;
}

function renderContentTypes({
  contentTypesData,
  spaceId
}: {
  contentTypesData: { [key: string]: any };
  spaceId: string;
}) {
  const ctsContainer = document.createElement("div");
  const header = document.createElement("h3");
  header.innerHTML = "Content types on the page:";
  ctsContainer.appendChild(header);
  const cleanupFns: Function[] = [];
  Object.keys(contentTypes)
    .map(key => ({ nodes: contentTypes[key], data: contentTypesData[key] }))
    .forEach(({ nodes = [], data }: { data: IEntity; nodes: any[] }) => {
      const element = document.createElement("div");
      const linkNode = document.createElement("a");
      const link = constructContentTypeURL({
        spaceId,
        contentType: data.sys.id
      });
      linkNode.setAttribute("href", link);
      linkNode.innerHTML = data.name || "";
      applyStyle({
        node: linkNode,
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
        onMouseLeave: () => {
          overlays.forEach(fn => fn());
          overlays = [];
        }
      });

      cleanupFns.push(cleanup);

      element.appendChild(linkNode);
      ctsContainer.appendChild(element);
    });

  return {
    node: ctsContainer,
    cleanup: () => {
      cleanupFns.forEach(fn => fn());
    }
  };
}
