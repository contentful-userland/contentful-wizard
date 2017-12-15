import { createClient, ContentfulClientApi } from "contentful";
import { attach, IAttachConfig } from "./attach";
import { IEntryTitle, IStyles } from "./types";
import { mergeStyle } from "./utils";

export const clients: { [key: string]: ContentfulClientApi } = {};

export function init({
  key,
  spaceId,
  preview,
  entryTitle,
  style
}: {
  key: string;
  spaceId: string;
  preview?: boolean;
  entryTitle?: IEntryTitle;
  style?: IStyles;
}) {
  clients[spaceId] = createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: spaceId,
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: key,
    // no additional requests
    resolveLinks: false,
    host: preview ? "preview.contentful.com" : undefined
  });

  const mergedStyle = mergeStyle(style);

  let cleanup: Function | null = attachHandlers({
    spaceId,
    entryTitle,
    style: mergedStyle
  });

  return {
    // cleanup old tooltips and reattach everything once again
    update: () => {
      cleanup && cleanup();
      cleanup = attachHandlers({ spaceId, entryTitle, style: mergedStyle });
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

  const cleanupFns: Function[] = [];

  Array.prototype.forEach.call(entryElements, (el: HTMLElement) => {
    const contentType = el.getAttribute("data-ctfl-content-type");
    const entry = el.getAttribute("data-ctfl-entry");
    const description = el.getAttribute("data-ctfl-description");
    const cleanup = attach({
      entryTitle,
      node: el,
      spaceId,
      contentType,
      entry,
      description,
      style
    } as IAttachConfig);

    cleanupFns.push(cleanup);
  });

  return () => cleanupFns.forEach(fn => fn());
}
