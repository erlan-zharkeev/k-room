export type IndexedDbRow = {
  id?: string
}

export type IndexedDbStoresData = Record<string, IndexedDbRow[]>

export type IndexedDbSeedItem = {
  id: string
  storeName: string
}
