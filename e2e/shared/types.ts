export type IndexedDbRowType = {
  id?: string
}

export type IndexedDbStoresDataType = Record<string, IndexedDbRowType[]>

export type IndexedDbSeedItemType = {
  id: string
  storeName: string
}
