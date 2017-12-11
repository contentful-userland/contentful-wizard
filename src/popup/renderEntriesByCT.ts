import { createElement } from "../utils";
import { getContentTypeNodes } from "../state";
import { renderEntries } from "./renderEntries";

export function renderEntriesByCt({
  contentType,
  contentTypesData,
  entriesData,
  spaceId
}: {
  contentType: string;
  contentTypesData: { [key: string]: any };
  entriesData: { [key: string]: any };
  spaceId: string;
}) {
  const container = createElement();
  const cleanupFns: Function[] = [];
  const filteredCTs = Object.keys(getContentTypeNodes()).filter(
    contentTypeAtPage => contentTypeAtPage !== contentType
  );
  [contentType].concat(filteredCTs).forEach(contentTypeAtPage => {
    const { node, cleanup } = renderEntries({
      contentType: contentTypeAtPage,
      contentTypesData,
      entriesData,
      spaceId
    });

    container.appendChild(node);
    cleanupFns.push(cleanup);
  });

  return {
    node: container,
    cleanup: () => {
      cleanupFns.forEach(fn => fn());
    }
  };
}
