import { ContentfulClientApi } from "contentful";

export interface IEntity {
  sys: {
    id: string;
  };
  name?: string;
}

const contentTypesData: { [key: string]: IEntity } = {};
const entriesData: { [key: string]: IEntity } = {};
const assetsData: { [key: string]: IEntity } = {};

let contentTypesPromise: Promise<any>;
let entriesPromise: Promise<any>;
let assetsPromise: Promise<any>;

export function fetchAssets({ client }: { client: ContentfulClientApi }) {
  if (!assetsPromise) {
    assetsPromise = client
      .getAssets({
        limit: 1000
      })
      .then(({ items }) => {
        items.forEach((item: IEntity) => {
          assetsData[item.sys.id] = item;
        });
      })
      .then();
  }

  return assetsPromise;
}

export function fetch({
  client,
  contentType,
  entry,
  asset
}: {
  client: ContentfulClientApi;
  contentType: string | null;
  entry: string | null;
  asset: string | null;
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
    entriesPromise = client
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

  if (!assetsPromise) {
    assetsPromise = client
      .getAssets({
        limit: 1000
      })
      .then(({ items }) => {
        items.forEach((item: IEntity) => {
          assetsData[item.sys.id] = item;
        });
      });
  }

  return Promise.all([contentTypesPromise, entriesPromise, assetsPromise])
    .then(() => {
      if (contentType) {
        // check content type
        const contentTypeFetchedData = contentTypesData[contentType];

        if (!contentTypeFetchedData) {
          return client.getContentType(contentType).then(item => {
            contentTypesData[item.sys.id] = item;
          });
        }
      }
    })
    .then(() => {
      if (entry) {
        // check entry
        const entryFetchedData = entriesData[entry];

        if (!entryFetchedData) {
          return client.getEntry(entry).then(item => {
            entriesData[item.sys.id] = item;
          });
        }
      }
    })
    .then(() => {
      if (asset) {
        const assetFetchedData = assetsData[asset];

        if (!assetFetchedData) {
          return client.getAsset(asset).then(item => {
            assetsData[item.sys.id] = item;
          });
        }
      }
    })
    .then(() => ({ contentTypesData, entriesData, assetsData }));
}
