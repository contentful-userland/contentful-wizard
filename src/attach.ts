import { showPopup } from "./popup";
import {
  getStyle,
  removeAssetNode,
  removeContentTypeNode,
  removeEntryNode,
  setAssetNode,
  setContentTypeNode,
  setEntryNode
} from "./state";
import { IEntryTitle, IStyles } from "./types";
import {
  applyStyle,
  containsNode,
  isBrowser,
  mergeStyle,
  onHover
} from "./utils";

export interface IAttachConfig {
  node: HTMLElement;
  contentType: string | null;
  entry: string | null;
  spaceId: string;
  environment?: string;
  asset: string | null;
  entryTitle?: IEntryTitle;
  description: string | null;
  style: IStyles;
}

export function attach({
  node,
  contentType,
  entry,
  spaceId,
  environment,
  entryTitle,
  description,
  style: rawStyle = getStyle({ spaceId }),
  asset
}: IAttachConfig) {
  if (!isBrowser()) {
    // tslint:disable-next-line no-empty
    return () => {};
  }

  if (contentType) {
    setContentTypeNode({ contentType, node });
  }

  if (contentType && entry) {
    setEntryNode({
      contentType,
      entry,
      node
    });
  }

  if (asset) {
    setAssetNode({
      asset,
      node
    });
  }

  const style =
    rawStyle === getStyle({ spaceId }) ? rawStyle : mergeStyle(rawStyle);

  let destroyPopup: Function | null;
  let popupNode: HTMLElement;

  applyStyle({
    node,
    style: style.highlight
  });
  // 1. add style to indicate that you can hover
  // 2. show tooltip on hover
  const cleanHover = onHover({
    node,
    onMouseEnter,
    onMouseLeave
  });

  function onMouseEnter() {
    applyStyle({
      node,
      style: style.highlightHover
    });
    destroyPopup && destroyPopup();
    const popupData = showPopup({
      node,
      spaceId,
      environment,
      entry,
      contentType,
      asset,
      cleanup: internalMouseLeave,
      entryTitle,
      description,
      style
    });
    destroyPopup = popupData.destroy;
    popupNode = popupData.node;
  }

  function onMouseLeave(e: MouseEvent) {
    const checkingNode = e.relatedTarget as HTMLElement;

    if (!containsNode({ node: popupNode, checkingNode })) {
      internalMouseLeave();
    }
  }

  return cleanup;

  function internalMouseLeave() {
    destroyPopup && destroyPopup();
    destroyPopup = null;
    applyStyle({
      node,
      style: style.highlight
    });
  }

  function cleanup() {
    if (contentType) {
      removeContentTypeNode({ contentType, node });
    }

    if (contentType && entry) {
      removeEntryNode({ contentType, node, entry });
    }

    if (asset) {
      removeAssetNode({ asset, node });
    }
    destroyPopup && destroyPopup();
    cleanHover && cleanHover();
  }
}
