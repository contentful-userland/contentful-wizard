import { fetch, IEntity } from "../fetch";
import { clients } from "../init";
import { IEntryTitle, IStyles } from "../types";
import { createElement } from "../utils";
import {
  constructContentTypeURL,
  constructEntryURL,
  constructSpaceURL
} from "../utils";
import { renderContentTypes } from "./renderContentTypes";
import { renderEntriesByCt } from "./renderEntriesByCt";

export function fetchContent({
  spaceId,
  contentType,
  entry,
  entryTitle,
  description,
  style
}: {
  spaceId: string;
  contentType: string;
  entry: string;
  entryTitle?: IEntryTitle;
  description?: string;
  style: IStyles;
}) {
  let closed = false;
  const client = clients[spaceId];
  const cleanupFns: Function[] = [];
  const promise = fetch({ client, contentType, entry }).then(
    ({ contentTypesData, entriesData }) => {
      if (!closed) {
        const container = document.createElement("div");
        const { node: ctsContainer, cleanup: ctsCleanup } = renderContentTypes({
          contentTypesData,
          spaceId,
          style
        });
        const {
          node: entriesContainer,
          cleanup: entriesCleanup
        } = renderEntriesByCt({
          contentType,
          contentTypesData,
          entriesData,
          entryTitle,
          spaceId,
          style
        });
        cleanupFns.push(ctsCleanup, entriesCleanup);

        const spaceURL = constructSpaceURL({ spaceId });
        const descriptionNode = createElement({
          text: description
        });
        const contentTypeURL = constructContentTypeURL({
          contentType,
          spaceId
        });
        const entryURL = constructEntryURL({ spaceId, entry });
        const spaceLink = renderLink({ href: spaceURL, text: "Link to space" });
        const ctLink = renderLink({
          href: contentTypeURL,
          text: "Link to content type"
        });
        const entryLink = renderLink({ href: entryURL, text: "Link to entry" });

        container.appendChild(descriptionNode);
        container.appendChild(spaceLink);
        container.appendChild(ctLink);
        container.appendChild(entryLink);

        container.appendChild(ctsContainer);
        container.appendChild(entriesContainer);

        return container;
      }
    }
  );

  return {
    promise,
    cleanup: () => {
      closed = true;
      cleanupFns.forEach(fn => fn());
    }
  };
}

function renderLink({ text, href }: { text: string; href: string }) {
  return createElement({
    tag: "a",
    attrs: {
      href,
      target: "_blank"
    },
    text,
    style: {
      textDecoration: "underline",
      color: "blue",
      display: "block"
    }
  });
}
