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
  onMouseEnter: Function;
  onMouseLeave: Function;
}) {
  node.addEventListener("mouseenter", internalMouseEnter);

  function internalMouseEnter(e: Event) {
    onMouseEnter(e);

    node.addEventListener("mouseleave", internalMouseLeave);
  }

  function internalMouseLeave(e: Event) {
    onMouseLeave(e);
    node.removeEventListener("mouseleave", internalMouseLeave);
  }

  return () => {
    node.removeEventListener("mouseenter", internalMouseEnter);
  };
}
