import { showPopup } from "./popup";
import {
  removeContentTypeNode,
  removeEntryNode,
  setContentTypeNode,
  setEntryNode
} from "./state";
import { IEntryTitle, IStyles } from "./types";
import { applyStyle, onHover } from "./utils";

export interface IAttachConfig {
  node: HTMLElement;
  contentType: string;
  entry: string;
  spaceId: string;
  entryTitle?: IEntryTitle;
  description?: string;
  style: IStyles;
}

export function attach({
  node,
  contentType,
  entry,
  spaceId,
  entryTitle,
  description,
  style
}: IAttachConfig) {
  setContentTypeNode({ contentType, node });
  setEntryNode({
    contentType,
    entry,
    node
  });
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
    removeContentTypeNode({ contentType, node });
    removeEntryNode({ contentType, node, entry });
    destroyPopup && destroyPopup();
    cleanHover && cleanHover();
  }
}
