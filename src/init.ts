import { createClient, ContentfulClientApi } from "contentful";
import { attach, IAttachConfig } from "./attach";

const config = {};

export const clients: { [key: string]: ContentfulClientApi } = {};

export function init({ key, spaceId }: { key: string; spaceId: string }) {
  clients[spaceId] = createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: spaceId,
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: key,
    // no additional requests
    resolveLinks: false
  });

  const allElements = document.querySelectorAll("[data-ctfl-entry]");

  Array.prototype.forEach.call(allElements, (el: HTMLElement) => {
    const contentType = el.getAttribute("data-ctfl-content-type");
    const entry = el.getAttribute("data-ctfl-entry");
    attach({
      node: el,
      spaceId,
      contentType,
      entry
    } as IAttachConfig);
  });
}
