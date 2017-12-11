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
