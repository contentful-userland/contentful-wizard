import { ContentfulClientApi, createClient } from "contentful";
import { attach, IAttachConfig } from "./attach";
import { setStyle } from "./state";
import { IEntryTitle, IStyles } from "./types";
import { isBrowser, mergeStyle } from "./utils";

export const clients: { [key: string]: ContentfulClientApi } = {};

export function init({
  key,
  spaceId,
  host,
  basePath,
  environment,
  entryTitle,
  style
}: {
  key: string;
  spaceId: string;
  host?: string;
  environment?: string;
  basePath?: string;
  entryTitle?: IEntryTitle;
  style?: IStyles;
}) {
  if (!isBrowser()) {
    return {
      // tslint:disable-next-line no-empty
      update: () => {},
      // tslint:disable-next-line no-empty
      destroy: () => {}
    };
  }

  clients[spaceId] = createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: spaceId,
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: key,
    // no additional requests
    resolveLinks: false,
    environment: environment ? environment : "master",
    basePath,
    host: host ? host : "cdn.contentful.com"
  });

  const mergedStyle = mergeStyle(style);

  setStyle({ spaceId, style: mergedStyle });

  let cleanup: Function | null = attachHandlers({
    spaceId,
    entryTitle,
    style: mergedStyle
  });

  return {
    // cleanup old tooltips and reattach everything once again
    update: () => {
      cleanup && cleanup();
      cleanup = attachHandlers({
        spaceId,
        entryTitle,
        style: mergedStyle
      });
    },
    destroy: () => {
      cleanup && cleanup();
      cleanup = null;
    }
  };
}

function attachHandlers({
  spaceId,
  entryTitle,
  style
}: {
  spaceId: string;
  entryTitle?: IEntryTitle;
  style: IStyles;
}) {
  const entryElements = document.querySelectorAll("[data-ctfl-entry]");
  const assetElements = document.querySelectorAll("[data-ctfl-asset]");

  const allElements = [
    ...Array.from(entryElements),
    ...Array.from(assetElements)
  ];

  const cleanupFns: Function[] = [];

  Array.prototype.forEach.call(allElements, (el: HTMLElement) => {
    const contentType = el.getAttribute("data-ctfl-content-type");
    const entry = el.getAttribute("data-ctfl-entry");
    const description = el.getAttribute("data-ctfl-description");
    const asset = el.getAttribute("data-ctfl-asset");
    const params: IAttachConfig = {
      entryTitle,
      node: el,
      spaceId,
      contentType,
      entry,
      description,
      style,
      asset
    };
    const cleanup = attach(params);

    cleanupFns.push(cleanup);
  });

  return () => cleanupFns.forEach(fn => fn());
}
