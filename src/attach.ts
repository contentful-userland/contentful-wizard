import {
  setContentTypeNode,
  removeContentTypeNode,
  setEntryNode,
  removeEntryNode
} from "./state";
import { showPopup } from "./popup";
import { onHover } from "./utils";
import { IEntryTitle } from "./types";

export interface IAttachConfig {
  node: HTMLElement;
  contentType: string;
  entry: string;
  spaceId: string;
  entryTitle?: IEntryTitle;
  description?: string;
}

export function attach({
  node,
  contentType,
  entry,
  spaceId,
  entryTitle,
  description
}: IAttachConfig) {
  setContentTypeNode({ contentType, node });
  setEntryNode({
    contentType,
    entry,
    node
  });
  let destroyPopup: Function | null;
  let popupNode: HTMLElement | null;

  node.style.border = "2px dashed red";
  // 1. add style to indicate that you can hover
  // 2. show tooltip on hover
  const cleanHover = onHover({
    node,
    onMouseEnter,
    onMouseLeave
  });

  function onMouseEnter() {
    node.style.border = "2px solid red";
    destroyPopup && destroyPopup();
    const popupData = showPopup({
      node,
      spaceId,
      entry,
      contentType,
      cleanup: internalMouseLeave,
      entryTitle,
      description
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
    node.style.border = "2px dashed red";
  }

  function cleanup() {
    removeContentTypeNode({ contentType, node });
    removeEntryNode({ contentType, node, entry });
    destroyPopup && destroyPopup();
    cleanHover && cleanHover();
  }
}
