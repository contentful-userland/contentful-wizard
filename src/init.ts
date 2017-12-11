import { createClient, ContentfulClientApi } from "contentful";
import { attach, IAttachConfig } from "./attach";
import { IEntryTitle } from "./types";

export const clients: { [key: string]: ContentfulClientApi } = {};

export function init({
  key,
  spaceId,
  entryTitle
}: {
  key: string;
  spaceId: string;
  entryTitle?: IEntryTitle;
}) {
  clients[spaceId] = createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: spaceId,
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: key,
    // no additional requests
    resolveLinks: false
  });

  let cleanup: Function | null = attachHandlers({ spaceId, entryTitle });

  return {
    // cleanup old tooltips and reattach everything once again
    update: () => {
      cleanup && cleanup();
      cleanup = attachHandlers({ spaceId, entryTitle });
    },
    remove: () => {
      cleanup && cleanup();
      cleanup = null;
    }
  };
}

function attachHandlers({
  spaceId,
  entryTitle
}: {
  spaceId: string;
  entryTitle?: IEntryTitle;
}) {
  const allElements = document.querySelectorAll("[data-ctfl-entry]");

  const cleanupFns: Function[] = [];

  Array.prototype.forEach.call(allElements, (el: HTMLElement) => {
    const contentType = el.getAttribute("data-ctfl-content-type");
    const entry = el.getAttribute("data-ctfl-entry");
    const cleanup = attach({
      entryTitle,
      node: el,
      spaceId,
      contentType,
      entry
    } as IAttachConfig);

    cleanupFns.push(cleanup);
  });

  return () => cleanupFns.forEach(fn => fn());
}
