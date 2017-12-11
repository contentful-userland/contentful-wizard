import { getContentTypeNodes } from "../state";
import {
  createElement,
  constructContentTypeURL,
  onHover,
  renderOverlay
} from "../utils";
import { IEntity } from "../fetch";

export function renderContentTypes({
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
