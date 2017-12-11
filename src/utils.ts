import { IEntryTitle } from "./types";
import { IEntity } from "./fetch";

const appPrefix = "https://app.contentful.com";

export function constructSpaceURL({ spaceId }: { spaceId: string }) {
  return `${appPrefix}/spaces/${spaceId}`;
}

export function constructContentTypeURL({
  spaceId,
  contentType
}: {
  spaceId: string;
  contentType: string;
}) {
  return `${appPrefix}/spaces/${spaceId}/content_types/${contentType}/fields`;
}

export function constructEntryURL({
  spaceId,
  entry
}: {
  spaceId: string;
  entry: string;
}) {
  return `${appPrefix}/spaces/${spaceId}/entries/${entry}`;
}

export function onHover({
  node,
  onMouseEnter,
  onMouseLeave
}: {
  node: HTMLElement;
  onMouseEnter?: Function;
  onMouseLeave?: Function;
}) {
  node.addEventListener("mouseenter", internalMouseEnter);

  function internalMouseEnter(e: MouseEvent) {
    onMouseEnter && onMouseEnter(e);

    node.addEventListener("mouseleave", internalMouseLeave);
  }

  function internalMouseLeave(e: MouseEvent) {
    onMouseLeave && onMouseLeave(e);
    node.removeEventListener("mouseleave", internalMouseLeave);
  }

  return () => {
    node.removeEventListener("mouseenter", internalMouseEnter);
  };
}

function sleep(amount: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, amount);
  });
}

export function animate({
  node,
  time = 200,
  start,
  stop,
  property = "opacity"
}: {
  node: HTMLElement;
  time?: number;
  start: number;
  stop: number;
  property?: "opacity";
}): Promise<void> {
  // no need to re-render more often than 16ms – 1 frame
  const steps = Math.ceil(time / 16);
  return new Promise(async resolve => {
    const period = (stop - start) / steps;

    for (let i = 0; i < steps; i++) {
      node.style[property] = String(start + period * i);
      await sleep(time / steps);
    }

    resolve();
  });
}

export function renderOverlay({ node }: { node: HTMLElement }) {
  const { bottom, top, left, right } = node.getBoundingClientRect();

  const offsetY = window.pageYOffset;
  const offsetX = window.pageXOffset;

  const overlay = createElement({
    style: {
      position: "absolute",
      opacity: "0",
      boxSizing: "border-box",
      // let's hope we override everything
      zIndex: "999",
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

export function getEntryTitle({
  entry,
  entryTitle
}: {
  entry: any;
  entryTitle?: IEntryTitle;
}) {
  const field = getEntryTitleField({ entry, entryTitle });
  let value;

  [field, "title", "name"].filter(Boolean).some((property: string) => {
    value = entry.fields[property];

    return Boolean(value);
  });

  return value || entry.sys.id;
}

function getEntryTitleField({
  entry,
  entryTitle
}: {
  entry: any;
  entryTitle?: IEntryTitle;
}) {
  if (typeof entryTitle === "string") {
    return entryTitle;
  } else if (typeof entryTitle === "object") {
    return entryTitle[entry.sys.contentType.id];
  }
}
