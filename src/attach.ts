import { contentTypes, entries } from "./state";
import { showPopup } from "./popup";
import { onHover } from "./utils";

export interface IAttachConfig {
  node: HTMLElement;
  contentType: string;
  entry: string;
  spaceId: string;
}

export function attach({ node, contentType, entry, spaceId }: IAttachConfig) {
  if (!contentTypes[contentType]) {
    contentTypes[contentType] = [];
  }

  if (!entries[entry]) {
    entries[entry] = [];
  }
  contentTypes[contentType].push(node);
  entries[entry].push(node);
  let destroyPopup: Function | null;
  let popupNode: HTMLElement | null;

  node.style.border = "3px dashed red";
  // 1. add style to indicate that you can hover
  // 2. show tooltip on hover
  const cleanHover = onHover({
    node,
    onMouseEnter,
    onMouseLeave
  });

  function onMouseEnter() {
    node.style.border = "3px solid red";
    const popupData = showPopup({
      node,
      spaceId,
      entry,
      contentType,
      cleanup: internalMouseLeave
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
    node.style.border = "3px dashed red";
  }

  function cleanup() {
    contentTypes[contentType] = contentTypes[contentType].filter(
      (nodeForCT: HTMLElement) => nodeForCT !== node
    );
    entries[entry] = entries[entry].filter(
      (nodeForEntry: HTMLElement) => nodeForEntry !== node
    );
    destroyPopup && destroyPopup();
    cleanHover && cleanHover();
  }
}
