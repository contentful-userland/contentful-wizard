import { getAssetsNodes } from "../state";
import { IStyles } from "../types";
import {
  constructAssetURL,
  createElement,
  onHover,
  renderOverlay
} from "../utils";

export function renderAssets({
  assetsData,
  spaceId,
  style,
  asset
}: {
  assetsData: { [key: string]: any };
  spaceId: string;
  style: IStyles;
  asset: string | null;
}) {
  const assetsContainer = document.createElement("div");
  const line = createElement({
    style: {
      height: "1px",
      margin: "10px 0",
      background: "#ccc"
    }
  });
  const header = createElement({
    tag: "h3",
    text: "Assets on the page:",
    style: {
      lineHeight: "1.31",
      fontSize: "1.17",
      marginTop: "0",
      marginBottom: "10px"
    }
  });

  const cleanupFns: Function[] = [];
  const assetNodes = getAssetsNodes();
  const filteredAssets = Object.keys(assetNodes).filter(
    assetAtPage => assetAtPage !== asset
  );
  const assetsOnPage = [asset].concat(filteredAssets).filter(Boolean);

  if (assetsOnPage.length > 0) {
    assetsContainer.appendChild(line);
    assetsContainer.appendChild(header);
  }

  assetsOnPage
    .map((key: string) => ({ nodes: assetNodes[key], data: assetsData[key] }))
    .forEach(({ nodes = [], data }: { data: any; nodes: any[] }) => {
      const element = document.createElement("div");
      const link = constructAssetURL({
        spaceId,
        asset: data.sys.id
      });

      const linkNode = createElement({
        tag: "a",
        attrs: {
          href: link,
          target: "_blank"
        },
        text: data.fields.title || data.sys.id,
        style: {
          display: "inline-block",
          borderBottom: "1px dashed #ccc",
          paddingBottom: "2px",
          textDecoration: "none",
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
      assetsContainer.appendChild(element);

      function cleanOverlays() {
        overlays.forEach(fn => fn());
        overlays = [];
      }
    });

  return {
    node: assetsContainer,
    cleanup: () => {
      cleanupFns.forEach(fn => fn());
    }
  };
}
