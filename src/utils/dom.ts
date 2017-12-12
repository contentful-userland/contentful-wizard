import { IEntryTitle } from "../types";
import { IEntity } from "../fetch";
import { animate } from "./animate";

export function renderOverlay({ node }: { node: HTMLElement }) {
  const { bottom, top, left, right } = node.getBoundingClientRect();

  const offsetY = window.pageYOffset;
  const offsetX = window.pageXOffset;

  const overlay = createElement({
    style: {
      position: "absolute",
      opacity: "0",
      boxSizing: "border-box",
      // let's hope we override everything, except the tooltip
      zIndex: "998",
      background: "red",
      top: `${offsetY + top}px`,
      height: `${bottom - top}px`,
      left: `${offsetX + left}px`,
      width: `${right - left}px`
    }
  });

  document.body.appendChild(overlay);

  animate({
    node: overlay,
    start: 0,
    stop: 0.25
  });

  return async () => {
    try {
      await animate({
        node: overlay,
        start: 0.25,
        stop: 0
      });
      document.body.removeChild(overlay);
    } catch (e) {
      console.log("error during removing overlay::", e);
    }
  };
}

export function applyStyle({
  node,
  style
}: {
  node: HTMLElement;
  style: { [key: string]: string };
}): void {
  Object.assign(node.style, style);
}

export function createElement(
  {
    tag = "div",
    text,
    style,
    attrs
  }: {
    tag?:
      | "div"
      | "img"
      | "a"
      | "h1"
      | "h2"
      | "h3"
      | "h4"
      | "h5"
      | "h6"
      | "span";
    text?: string;
    style?: { [key: string]: string };
    attrs?: { [key: string]: string };
  } = {}
): HTMLElement {
  const element = document.createElement(tag);
  if (text) {
    element.innerHTML = text;
  }

  if (style) {
    applyStyle({
      node: element,
      style
    });
  }

  if (attrs) {
    Object.keys(attrs).forEach(attr => {
      const value = attrs[attr];

      element.setAttribute(attr, value);
    });
  }

  return element;
}
