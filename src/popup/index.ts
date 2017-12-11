import { createElement, animate, onHover } from "../utils";
import { fetchContent } from "./fetch";
import { IEntryTitle } from "../types";

export function showPopup({
  node,
  spaceId,
  contentType,
  entry,
  cleanup,
  entryTitle
}: {
  node: HTMLElement;
  spaceId: string;
  contentType: string;
  entry: string;
  cleanup: Function;
  entryTitle?: IEntryTitle;
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
    entry,
    entryTitle
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
