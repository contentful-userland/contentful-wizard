import { fetch } from "../fetch";
import { clients } from "../init";
import { IEntryTitle, IStyles } from "../types";
import { constructAssetURL, createElement } from "../utils";
import {
  constructContentTypeURL,
  constructEntryURL,
  constructSpaceURL
} from "../utils";
import { renderAssets } from "./renderAssets";
import { renderContentTypes } from "./renderContentTypes";
import { renderEntriesByCt } from "./renderEntriesByCt";

export function fetchContent({
  spaceId,
  environment,
  contentType,
  entry,
  asset,
  entryTitle,
  description,
  style
}: {
  spaceId: string;
  environment?: string;
  contentType: string | null;
  entry: string | null;
  asset: string | null;
  entryTitle?: IEntryTitle;
  description: string | null;
  style: IStyles;
}) {
  let closed = false;
  const client = clients[spaceId];
  const cleanupFns: Function[] = [];
  const promise = fetch({ client, contentType, entry, asset }).then(
    ({ contentTypesData, entriesData, assetsData }) => {
      if (!closed) {
        const container = document.createElement("div");
        const { node: ctsContainer, cleanup: ctsCleanup } = renderContentTypes({
          contentType,
          contentTypesData,
          spaceId,
          environment,
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
          environment,
          style
        });

        const { node: assetsContainer, cleanup: assetsCleanup } = renderAssets({
          assetsData,
          spaceId,
          style,
          asset
        });
        cleanupFns.push(ctsCleanup, entriesCleanup, assetsCleanup);

        const spaceURL = constructSpaceURL({ spaceId });
        const descriptionNode = createElement({
          text: description
        });

        const spaceLink = renderLink({ href: spaceURL, text: "Link to space" });

        container.appendChild(descriptionNode);
        container.appendChild(spaceLink);

        if (contentType) {
          const contentTypeURL = constructContentTypeURL({
            contentType,
            spaceId,
            environment
          });
          const ctLink = renderLink({
            href: contentTypeURL,
            text: "Link to content type"
          });
          container.appendChild(ctLink);
        }

        if (entry) {
          const entryURL = constructEntryURL({ spaceId, entry, environment });
          const entryLink = renderLink({
            href: entryURL,
            text: "Link to entry"
          });
          container.appendChild(entryLink);
        }

        if (asset) {
          const assetURL = constructAssetURL({ spaceId, asset, environment });
          const assetLink = renderLink({
            href: assetURL,
            text: "Link to asset"
          });
          container.appendChild(assetLink);
        }

        container.appendChild(ctsContainer);
        container.appendChild(entriesContainer);
        container.appendChild(assetsContainer);

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
