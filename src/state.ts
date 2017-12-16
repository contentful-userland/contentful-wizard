import { IStyles } from "./types";

export interface IContentTypeNodes {
  [key: string]: HTMLElement[];
}

export interface IEntryNodes {
  [key: string]: {
    [key: string]: HTMLElement[];
  };
}

export interface IAssetNodes {
  [key: string]: HTMLElement[];
}

const contentTypeNodes: IContentTypeNodes = {};
const entryNodes: IEntryNodes = {};
const assetNodes: IAssetNodes = {};

const styles: { [key: string]: IStyles } = {};

export function setStyle({
  spaceId,
  style
}: {
  spaceId: string;
  style: IStyles;
}) {
  styles[spaceId] = style;
}

export function getStyle({ spaceId }: { spaceId: string }) {
  return styles[spaceId];
}

export function getAssetsNodes(): IAssetNodes {
  return assetNodes;
}

export function getAssetNodes({ asset }: { asset: string }): HTMLElement[] {
  return assetNodes[asset] || [];
}

export function removeAssetNode({
  asset,
  node
}: {
  asset: string;
  node: HTMLElement;
}): IAssetNodes {
  if (assetNodes[asset]) {
    assetNodes[asset] = assetNodes[asset].filter(
      assetNode => assetNode !== node
    );
  }

  return assetNodes;
}

export function setAssetNode({
  asset,
  node
}: {
  asset: string;
  node: HTMLElement;
}): IAssetNodes {
  if (!assetNodes[asset]) {
    assetNodes[asset] = [];
  }

  assetNodes[asset].push(node);

  return assetNodes;
}

export function getContentTypeNodes(): IContentTypeNodes {
  return contentTypeNodes;
}

export function getContentTypeNode({
  contentType
}: {
  contentType: string;
}): HTMLElement[] {
  return contentTypeNodes[contentType] || [];
}

export function setContentTypeNode({
  contentType,
  node
}: {
  contentType: string;
  node: HTMLElement;
}): IContentTypeNodes {
  if (!contentTypeNodes[contentType]) {
    contentTypeNodes[contentType] = [];
  }

  contentTypeNodes[contentType].push(node);

  return contentTypeNodes;
}

export function removeContentTypeNode({
  contentType,
  node: removeNode
}: {
  contentType: string;
  node: HTMLElement;
}): IContentTypeNodes {
  if (contentTypeNodes[contentType]) {
    contentTypeNodes[contentType] = contentTypeNodes[contentType].filter(
      node => node !== removeNode
    );
  }

  return contentTypeNodes;
}

export function getCTEntryNodes({
  contentType
}: {
  contentType: string;
}): { [key: string]: HTMLElement[] } {
  return entryNodes[contentType] || [];
}

export function getEntryNodes({
  contentType,
  entry
}: {
  contentType: string;
  entry: string;
}): HTMLElement[] {
  if (entryNodes[contentType] && entryNodes[contentType][entry]) {
    return entryNodes[contentType][entry];
  }

  return [];
}

export function setEntryNode({
  contentType,
  entry,
  node
}: {
  contentType: string;
  entry: string;
  node: HTMLElement;
}): IEntryNodes {
  if (!entryNodes[contentType]) {
    entryNodes[contentType] = {};
  }

  if (!entryNodes[contentType][entry]) {
    entryNodes[contentType][entry] = [];
  }

  entryNodes[contentType][entry].push(node);

  return entryNodes;
}

export function removeEntryNode({
  contentType,
  node: entryNode,
  entry
}: {
  contentType: string;
  node: HTMLElement;
  entry: string;
}): IEntryNodes {
  if (entryNodes[contentType] && entryNodes[contentType][entry]) {
    entryNodes[contentType][entry] = entryNodes[contentType][entry].filter(
      node => node !== entryNode
    );
  }

  return entryNodes;
}
