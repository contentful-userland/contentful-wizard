import { fetch, IEntity } from "./fetch";
import { clients } from "./init";
import { contentTypes, entries } from "./state";
import { animate, renderOverlay } from "./utils";
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
  tooltip.style.position = "absolute";
  tooltip.style.background = "#fff";
  tooltip.style.zIndex = "999";
  tooltip.style.minWidth = "150px";
  tooltip.style.maxWidth = "350px";
  tooltip.style.padding = "15px";
  tooltip.style.left = `${right - 5}px`;
  tooltip.style.top = `${top + 30}px`;
  tooltip.style.border = "1px solid #ccc";
  tooltip.style.borderRadius = "3px";

  tooltip.innerHTML = "loading...";
  tooltip.style.opacity = "0";

  fetchContent({ spaceId, contentType, entry }).then(content => {
    tooltip.innerHTML = "";
    tooltip.appendChild(content);
  });

  document.body.appendChild(tooltip);

  animate({
    node: tooltip,
    time: 500,
    start: 0,
    stop: 1,
    property: "opacity"
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
      await animate({
        node: tooltip,
        time: 500,
        start: 1,
        stop: 0,
        property: "opacity"
      });
      cleanupHover();
      document.body.removeChild(tooltip);
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
  const client = clients[spaceId];
  return fetch({ client, contentType, entry }).then(({ contentTypesData }) => {
    const ctsContainer = document.createElement("div");
    Object.keys(contentTypes)
      .map(key => ({ nodes: contentTypes[key], data: contentTypesData[key] }))
      .forEach(({ nodes = [], data }: { data: IEntity; nodes: any[] }) => {
        const element = document.createElement("a");
        const link = constructContentTypeURL({
          spaceId,
          contentType: data.sys.id
        });
        element.setAttribute("href", link);
        element.innerHTML = data.name || "";

        const overlays: Function[] = [];

        onHover({
          node: element,
          onMouseEnter: () => {
            nodes.forEach(node => {
              overlays.push(renderOverlay({ node }));
            });
          },
          onMouseLeave: () => {
            overlays.forEach(fn => fn());
          }
        });

        ctsContainer.appendChild(element);
      });

    const container = document.createElement("div");

    const spaceURL = constructSpaceURL({ spaceId });
    const contentTypeURL = constructContentTypeURL({ spaceId, contentType });
    const entryURL = constructEntryURL({ spaceId, entry });
    const spaceLink = document.createElement("a");
    spaceLink.setAttribute("href", spaceURL);
    spaceLink.setAttribute("target", "_blank");
    spaceLink.innerHTML = "Link to space";
    const ctLink = document.createElement("a");
    ctLink.setAttribute("href", contentTypeURL);
    ctLink.setAttribute("target", "_blank");
    ctLink.innerHTML = "Link to content type";
    const entryLink = document.createElement("a");
    entryLink.setAttribute("href", entryURL);
    entryLink.setAttribute("target", "_blank");
    entryLink.innerHTML = "Link to entry";

    container.appendChild(spaceLink);
    container.appendChild(ctLink);
    container.appendChild(entryLink);

    container.appendChild(ctsContainer);

    return container;
  });
}
