import { IEntryTitle, IStyles } from "../types";
import { animate, createElement, onHover } from "../utils";
import { fetchContent } from "./fetch";

export function showPopup({
  node,
  spaceId,
  contentType,
  entry,
  cleanup,
  asset,
  entryTitle,
  description,
  style
}: {
  node: HTMLElement;
  spaceId: string;
  contentType: string | null;
  entry: string | null;
  asset: string | null;
  cleanup: Function;
  entryTitle?: IEntryTitle;
  description: string | null;
  style: IStyles;
}) {
  const { top, right } = node.getBoundingClientRect();
  const offsetY = window.pageYOffset;

  const tooltip: HTMLElement = createElement({
    style: Object.assign({}, style.tooltip, {
      left: `${right - 5}px`,
      top: `${offsetY + top + 15}px`
    }),
    text: `
      <div>
        ${description}
      </div>
      loading...`
  });

  const { promise, cleanup: cleanupContent } = fetchContent({
    spaceId,
    contentType,
    entry,
    asset,
    entryTitle,
    description,
    style
  });

  promise.then(content => {
    if (content) {
      tooltip.innerHTML = "";
      // we need to calculate height somehow
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
        // tslint:disable-next-line no-console
        console.log("error during removing tooltip::", e);
      }
    }
  };
}
