import { IEntryTitle, IStyles } from "../types";
import {
  animate,
  applyStyle,
  containsNode,
  createElement,
  measureHeight,
  onHover
} from "../utils";
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
  const loadingContent = `
  <div>
    ${description}
  </div>
  loading...`;
  const positionStyles = getCoords({ node, content: loadingContent });
  const tooltip: HTMLElement = createElement({
    style: Object.assign({}, style.tooltip, positionStyles),
    text: loadingContent
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
      const newPositionStyles = getCoords({ node, content });
      applyStyle({
        node: tooltip,
        style: newPositionStyles
      });
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
      const checkingNode = e.relatedTarget as HTMLElement;
      if (!containsNode({ node, checkingNode })) {
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

function getCoords({
  node,
  content
}: {
  node: HTMLElement;
  content: HTMLElement | string;
}) {
  const horizontalStyles = positionHorizontally({ node });
  const verticalStyles = positionVertically({ node, content });
  return Object.assign({}, horizontalStyles, verticalStyles);
}

function positionHorizontally({ node }: { node: HTMLElement }) {
  const { right, left } = node.getBoundingClientRect();
  const offsetX = window.pageXOffset;

  const pageWidth = document.documentElement.clientWidth;

  const rightSpace = pageWidth - right;
  const leftSpace = left;

  const positionStyles: { [key: string]: string } = {};

  // by default we try to show it from the right side
  if (rightSpace > 350) {
    positionStyles.left = `${offsetX + right - 5}px`;
    positionStyles.right = "auto";
  } else if (leftSpace > 350) {
    positionStyles.right = `${offsetX + pageWidth - left - 5}px`;
    positionStyles.left = "auto";
  } else {
    // we have to render it inside, and we do it on the right side
    positionStyles.right = `${offsetX + rightSpace + 5}px`;
    positionStyles.left = "auto";
  }

  return positionStyles;
}

function positionVertically({
  node,
  content
}: {
  node: HTMLElement;
  content: HTMLElement | string;
}) {
  const { top, height } = node.getBoundingClientRect();
  const offsetY = window.pageYOffset;
  const pageHeight = document.documentElement.clientHeight;
  const mediumOffset = top + height / 2;

  const maxSpace = Math.min(mediumOffset, pageHeight - mediumOffset) * 2;
  const contentHeight = measureHeight(content);

  const positionStyles: { [key: string]: string } = {};
  if (contentHeight >= pageHeight) {
    positionStyles.top = `${offsetY}px`;
    positionStyles.bottom = `auto`;
  } else if (contentHeight <= maxSpace) {
    positionStyles.top = `${offsetY + mediumOffset - contentHeight / 2}px`;
    positionStyles.bottom = `auto`;
  } else {
    const topOffset =
      mediumOffset < pageHeight - mediumOffset
        ? offsetY
        : offsetY + pageHeight - contentHeight;

    positionStyles.top = `${topOffset}px`;
    positionStyles.bottom = `auto`;
  }

  return positionStyles;
}
