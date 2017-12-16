import { getCTEntryNodes } from "../state";
import { IEntryTitle, IStyles } from "../types";
import {
  constructEntryURL,
  createElement,
  getEntryTitle,
  onHover,
  renderOverlay
} from "../utils";

export function renderEntries({
  contentTypesData,
  entriesData,
  spaceId,
  contentType,
  entryTitle,
  style
}: {
  contentTypesData: { [key: string]: any };
  entriesData: { [key: string]: any };
  spaceId: string;
  contentType: string;
  entryTitle?: IEntryTitle;
  style: IStyles;
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
      lineHeight: "1.31",
      fontSize: "1.17",
      marginTop: "0",
      marginBottom: "10px"
    }
  });

  const cleanupFns: Function[] = [];

  const entries = getCTEntryNodes({ contentType });
  const entriesKeys = Object.keys(entries);

  if (entriesKeys.length > 0) {
    ctsContainer.appendChild(line);
    ctsContainer.appendChild(header);
  }

  entriesKeys
    .map(entryId => ({
      entry: entryId,
      nodes: entries[entryId],
      data: entriesData[entryId]
    }))
    .forEach(({ entry, nodes, data }) => {
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
        text: getEntryTitle({ entry: data, entryTitle }),
        style: {
          display: "inline-block",
          borderBottom: "1px dashed #ccc",
          textDecoration: "none",
          paddingBottom: "2px",
          marginBottom: "5px"
        }
      });

      let overlays: Function[] = [];

      const cleanup = onHover({
        node: linkNode,
        onMouseEnter: () => {
          nodes.forEach(node => {
            overlays.push(renderOverlay({ node, style: style.overlay }));
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
