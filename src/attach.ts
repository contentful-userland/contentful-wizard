import { showPopup } from "./popup";
import {
  removeAssetNode,
  removeContentTypeNode,
  removeEntryNode,
  setAssetNode,
  setContentTypeNode,
  setEntryNode
} from "./state";
import { IEntryTitle, IStyles } from "./types";
import { applyStyle, onHover } from "./utils";

export interface IAttachConfig {
  node: HTMLElement;
  contentType: string | null;
  entry: string | null;
  spaceId: string;
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
  entryTitle,
  description,
  style,
  asset
}: IAttachConfig) {
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

  let destroyPopup: Function | null;
  let popupNode: HTMLElement | null;

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
    const toNode = e.relatedTarget;

    if (toNode !== popupNode) {
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
