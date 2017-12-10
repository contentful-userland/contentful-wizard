import { ContentfulClientApi } from "contentful";

export interface IEntity {
  sys: {
    id: string;
  };
  name?: string;
}

const contentTypesData: { [key: string]: IEntity } = {};
const entriesData: { [key: string]: IEntity } = {};

let contentTypesPromise: Promise<any>, entriesPromise: Promise<any>;

export function fetch({
  client,
  contentType,
  entry
}: {
  client: ContentfulClientApi;
  contentType: string;
  entry: string;
}) {
  if (!contentTypesPromise) {
    contentTypesPromise = client
      .getContentTypes({
        // maximum – we should try to download everything
        limit: 1000
      })
      .then(({ items }: { items: IEntity[] }) => {
        // ignore that we can skip some data
        items.forEach((item: IEntity) => {
          contentTypesData[item.sys.id] = item;
        });
      });
  }

  if (!entriesPromise) {
    const entriesPromise = client
      .getEntries({
        // maximum – we should try to download everything
        limit: 1000
      })
      .then(({ items }: { items: IEntity[] }) => {
        // ignore that we can skip some data
        items.forEach(item => {
          entriesData[item.sys.id] = item;
        });
      });
  }

  return Promise.all([contentTypesPromise, entriesPromise])
    .then(() => {
      // check content type
      const contentTypeFetchedData = contentTypesData[contentType];

      if (!contentTypeFetchedData) {
        return client.getContentType(contentType).then(item => {
          contentTypesData[item.sys.id] = item;
        });
      }
    })
    .then(() => {
      // check entry
      const entryFetchedData = entriesData[entry];

      if (!entryFetchedData) {
        return client.getEntry(contentType).then(item => {
          contentTypesData[item.sys.id] = item;
        });
      }
    })
    .then(() => ({ contentTypesData, entriesData }));
}
