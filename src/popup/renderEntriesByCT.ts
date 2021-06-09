import { getContentTypeNodes } from "../state";
import { IEntryTitle, IStyles } from "../types";
import { createElement } from "../utils";
import { renderEntries } from "./renderEntries";

export function renderEntriesByCt({
  contentType,
  contentTypesData,
  entriesData,
  spaceId,
  environment,
  entryTitle,
  style
}: {
  contentType: string | null;
  contentTypesData: { [key: string]: any };
  entriesData: { [key: string]: any };
  spaceId: string;
  environment?: string;
  entryTitle?: IEntryTitle;
  style: IStyles;
}) {
  const container = createElement();
  const cleanupFns: Function[] = [];
  const filteredCTs = Object.keys(getContentTypeNodes()).filter(
    contentTypeAtPage => contentTypeAtPage !== contentType
  );
  [contentType]
    .concat(filteredCTs)
    .filter(Boolean)
    .forEach((contentTypeAtPage: string) => {
      const { node, cleanup } = renderEntries({
        contentType: contentTypeAtPage,
        contentTypesData,
        entriesData,
        spaceId,
        environment,
        entryTitle,
        style
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
