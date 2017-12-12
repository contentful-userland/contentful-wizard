import { createElement } from "../utils";
import { getContentTypeNodes } from "../state";
import { renderEntries } from "./renderEntries";
import { IEntryTitle } from "../types";

export function renderEntriesByCt({
  contentType,
  contentTypesData,
  entriesData,
  spaceId,
  entryTitle
}: {
  contentType: string;
  contentTypesData: { [key: string]: any };
  entriesData: { [key: string]: any };
  spaceId: string;
  entryTitle?: IEntryTitle;
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
      spaceId,
      entryTitle
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
