import { fetch, IEntity } from "./fetch";
import { clients } from "./init";
import { contentTypes, entries } from "./state";
import {
  onHover,
  constructSpaceURL,
  constructContentTypeURL,
  constructEntryURL
} from "./utils";

export function showPopup({
  // node,
  spaceId,
  contentType,
  entry
}: {
  node: HTMLElement;
  spaceId: string;
  contentType: string;
  entry: string;
}) {
  const client = clients[spaceId];
  fetch({ client, contentType, entry }).then(({ contentTypesData }) => {
    const ctsContainer = document.createElement("div");
    Object.keys(contentTypes)
      .map(key => ({ nodes: contentTypes[key], data: contentTypesData[key] }))
      .forEach(({ nodes = [], data }: { data: IEntity; nodes: any[] }) => {
        const element = document.createElement("a");
        const link = constructContentTypeURL({
          spaceId,
          contentType: data.sys.id
        });
        element.setAttribute("href", link);
        element.innerHTML = data.name || "";

        onHover({
          node: element,
          onMouseEnter: () => {
            nodes.forEach(node => {
              node.style.background = "red";
            });
          },
          onMouseLeave: () => {
            nodes.forEach(node => {
              node.style.background = "";
            });
          }
        });

        ctsContainer.appendChild(element);
      });

    const container = document.createElement("div");

    const spaceURL = constructSpaceURL({ spaceId });
    const contentTypeURL = constructContentTypeURL({ spaceId, contentType });
    const entryURL = constructEntryURL({ spaceId, entry });
    const spaceLink = document.createElement("a");
    spaceLink.setAttribute("href", spaceURL);
    spaceLink.setAttribute("target", "_blank");
    spaceLink.innerHTML = "Link to space";
    const ctLink = document.createElement("a");
    ctLink.setAttribute("href", contentTypeURL);
    ctLink.setAttribute("target", "_blank");
    ctLink.innerHTML = "Link to content type";
    const entryLink = document.createElement("a");
    entryLink.setAttribute("href", entryURL);
    entryLink.setAttribute("target", "_blank");
    entryLink.innerHTML = "Link to entry";

    container.appendChild(spaceLink);
    container.appendChild(ctLink);
    container.appendChild(entryLink);

    container.appendChild(ctsContainer);

    document.body.appendChild(container);
  });

  return () => {};
}
