import { IEntryTitle } from "../types";

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

export function constructMediaURL({ spaceId }: { spaceId: string }) {
  return `${appPrefix}/spaces/${spaceId}/assets`;
}

export function constructAssetURL({
  spaceId,
  asset
}: {
  spaceId: string;
  asset: string;
}) {
  return `${appPrefix}/spaces/${spaceId}/assets/${asset}`;
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
