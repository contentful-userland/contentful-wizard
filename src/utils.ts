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
    onMouseEnter && onMouseLeave(e);
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
  time = 500,
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
      node.style[property] = String(start - period * i);
      await sleep(time / steps);
    }

    resolve();
  });
}

export function renderOverlay({ node }: { node: HTMLElement }) {
  const { bottom, top, left, right } = node.getBoundingClientRect();

  const offsetY = window.pageYOffset;
  const offsetX = window.pageXOffset;

  const overlay = document.createElement("div");
  overlay.style.position = "absolute";
  overlay.style.opacity = "0";
  overlay.style.boxSizing = "border-box";
  // let's hope we override everything
  overlay.style.zIndex = "999";
  overlay.style.background = "red";
  overlay.style.top = `${offsetY + top}px`;
  overlay.style.height = `${bottom - top}px`;
  overlay.style.left = `${offsetX + left}px`;
  overlay.style.width = `${right - left}px`;

  document.body.appendChild(overlay);

  animate({
    node: overlay,
    start: 0,
    stop: 0.25
  });

  return async () => {
    await animate({
      node: overlay,
      start: 0.25,
      stop: 0
    });
  };
}
