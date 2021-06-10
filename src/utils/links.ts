import { IEntryTitle } from "../types";

const appPrefix = "https://app.contentful.com";

export function constructSpaceURL({ spaceId }: { spaceId: string }) {
  return `${appPrefix}/spaces/${spaceId}`;
}

export function constructContentTypeURL({
  spaceId,
  contentType,
  environment
}: {
  spaceId: string;
  contentType: string;
  environment?: string;
}) {
  return environment
    ? `${appPrefix}/spaces/${spaceId}/environments/${environment}/content_types/${contentType}/fields`
    : `${appPrefix}/spaces/${spaceId}/content_types/${contentType}/fields`;
}

export function constructEntryURL({
  spaceId,
  entry,
  environment
}: {
  spaceId: string;
  entry: string;
  environment?: string;
}) {
  return environment
    ? `${appPrefix}/spaces/${spaceId}/environments/${environment}/entries/${entry}`
    : `${appPrefix}/spaces/${spaceId}/entries/${entry}`;
}

export function constructMediaURL({
  spaceId,
  environment
}: {
  spaceId: string;
  environment: string | undefined;
}) {
  return environment
    ? `${appPrefix}/spaces/${spaceId}/environments/${environment}/assets`
    : `${appPrefix}/spaces/${spaceId}/assets`;
}

export function constructAssetURL({
  spaceId,
  asset,
  environment
}: {
  spaceId: string;
  asset: string;
  environment?: string;
}) {
  return environment
    ? `${appPrefix}/spaces/${spaceId}/environments/${environment}/assets/${asset}`
    : `${appPrefix}/spaces/${spaceId}/assets/${asset}`;
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
