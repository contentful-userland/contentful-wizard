import { IEntity } from "../fetch";
import { getContentTypeNodes } from "../state";
import { IStyles } from "../types";
import {
  constructContentTypeURL,
  createElement,
  onHover,
  renderOverlay
} from "../utils";

export function renderContentTypes({
  contentTypesData,
  spaceId,
  style,
  contentType
}: {
  contentTypesData: { [key: string]: any };
  spaceId: string;
  style: IStyles;
  contentType: string | null;
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
      lineHeight: "1.31",
      fontSize: "1.17em",
      marginTop: "0",
      marginBottom: "10px"
    }
  });

  const cleanupFns: Function[] = [];
  const contentTypeNodes = getContentTypeNodes();
  const filteredCTNodes = Object.keys(contentTypeNodes).filter(
    contentTypeAtPage => contentTypeAtPage !== contentType
  );
  const ctsOnPage = [contentType]
    .concat(filteredCTNodes)
    .filter(Boolean)
    .map((key: string) => ({
      nodes: contentTypeNodes[key],
      data: contentTypesData[key]
    }))
    .filter(({ nodes }) => nodes && nodes.length > 0);

  if (ctsOnPage.length > 0) {
    ctsContainer.appendChild(line);
    ctsContainer.appendChild(header);
  }
  ctsOnPage.forEach(({ nodes = [], data }: { data: IEntity; nodes: any[] }) => {
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
