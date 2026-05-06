import type { Table } from 'dexie'
import set from 'lodash/set'
import unset from 'lodash/unset'

import { cloneMutable } from './clone-mutable'
import type { DbTransactionModeType, ICollectionMergeManyOptions, IndexableType, MutableType } from './types'
import { useDexieLiveQuery } from './use-dexie-live-query'

const collectionInitializers = new Set<() => Promise<void>>()

export const initializeDexieCollectionStores = async () => {
  await Promise.all([...collectionInitializers].map((initialize) => initialize()))
}

export const dexieCollectionStore = <T extends { id: string | number }>(table: Table<T>) => {
  type Item = T
  type ItemId = Item['id']
  let cachedItems: Item[] | undefined

  const updateCachedItems = (items: readonly Item[]) => {
    if (!cachedItems) return

    const itemById = new Map(cachedItems.map((item) => [item.id, item]))

    items.forEach((item) => {
      itemById.set(item.id, item)
    })
    cachedItems = [...itemById.values()]
  }

  const removeCachedItems = (ids: readonly ItemId[]) => {
    if (!cachedItems) return

    const idSet = new Set(ids)

    cachedItems = cachedItems.filter(({ id }) => !idSet.has(id))
  }

  const get = (id: ItemId): Promise<Item | undefined> => table.get(id as never)

  const bulkGet = (ids: readonly ItemId[]): Promise<(Item | undefined)[]> => table.bulkGet(ids as never[])

  const getAll = async (): Promise<Item[]> => {
    cachedItems = await table.toArray()

    return cachedItems
  }

  const initialize = async () => {
    await getAll()
  }

  collectionInitializers.add(initialize)

  const use = (defaults: Item[] = []) => useDexieLiveQuery(getAll, cachedItems ?? defaults).data

  const useById = <D = Item | undefined>(id: ItemId | null | undefined, defaults?: D) => {
    const initialValue =
      id == null ? defaults : (cachedItems?.find((item) => item.id === id) as D | undefined) ?? defaults

    return useDexieLiveQuery(async () => {
      if (id == null) return defaults as D

      return ((await get(id)) as D | undefined) ?? (defaults as D)
    }, initialValue as D).data
  }

  const put = async (data: Item) => {
    await table.put(data)
    updateCachedItems([data])
  }

  const bulkPut = async (data: readonly Item[]) => {
    if (!data.length) return

    await table.bulkPut(data as Item[])
    updateCachedItems(data)
  }

  const update = async (id: ItemId, changes: Partial<Item>) => {
    const updated = await table.update(id as never, changes as never)

    if (updated && cachedItems) {
      cachedItems = cachedItems.map((item) => (item.id === id ? ({ ...item, ...changes } as Item) : item))
    }

    return updated
  }

  const deleteById = async (id: ItemId) => {
    await table.delete(id as never)
    removeCachedItems([id])
  }

  const bulkDelete = async (ids: readonly ItemId[]) => {
    if (!ids.length) return

    await table.bulkDelete(ids as never[])
    removeCachedItems(ids)
  }

  const clear = async () => {
    await table.clear()
    cachedItems = []
  }

  const transaction = async <R>(mode: DbTransactionModeType, callback: () => Promise<R> | R) => {
    return table.db.transaction(mode, table, callback)
  }

  const replaceAll = async (data: readonly Item[]) => {
    await transaction('rw', async () => {
      await table.clear()

      if (data.length) {
        await table.bulkPut(data as Item[])
      }
    })
    cachedItems = [...data]
  }

  const mergeMany = async <Incoming extends { id: ItemId }>(
    data: readonly Incoming[],
    options: ICollectionMergeManyOptions<Item, Incoming>
  ) => {
    const { merge, removeMissing = false } = options
    const shouldRefreshCache = Boolean(cachedItems)

    await transaction('rw', async () => {
      if (!data.length) {
        if (removeMissing) {
          await table.clear()
        }

        return
      }

      const incomingIds = data.map((item) => item.id)
      const existingItems = removeMissing ? await table.toArray() : await bulkGet(incomingIds)
      const existingMap = new Map<ItemId, Item>()

      existingItems.forEach((item) => {
        if (item) {
          existingMap.set(item.id as ItemId, item)
        }
      })

      const nextItems: Item[] = []

      data.forEach((incoming) => {
        const current = existingMap.get(incoming.id)
        const next = merge(current, incoming)

        if (!current || !Object.is(current, next)) {
          nextItems.push(next)
        }
      })

      if (nextItems.length) {
        await table.bulkPut(nextItems)
      }

      if (removeMissing) {
        const incomingIdSet = new Set(incomingIds)
        const idsToDelete = [...existingMap.keys()].filter((id) => !incomingIdSet.has(id))

        if (idsToDelete.length) {
          await table.bulkDelete(idsToDelete as never[])
        }
      }
    })

    if (shouldRefreshCache) {
      await getAll()
    }
  }

  const mutate = async (id: ItemId, mutator: (draft: MutableType<Item>) => void) => {
    let nextItem: Item | undefined

    await transaction('rw', async () => {
      const current = await get(id)

      if (!current) return

      const draft = cloneMutable(current)

      mutator(draft)
      nextItem = draft as Item
      await table.put(nextItem)
    })

    if (nextItem) {
      updateCachedItems([nextItem])
    }
  }

  const updateShallow = async (id: ItemId, changes: Partial<Item>) => {
    await mutate(id, (draft) => {
      Object.assign(draft, changes)
    })
  }

  const setByPath = async (id: ItemId, path: string, value: unknown) => {
    await mutate(id, (draft) => {
      set(draft, path, value)
    })
  }

  const unsetByPath = async (id: ItemId, path: string) => {
    await mutate(id, (draft) => {
      unset(draft, path)
    })
  }

  const patchByPath = async (id: ItemId, patch: IndexableType) => {
    await mutate(id, (draft) => {
      Object.entries(patch).forEach(([path, value]) => {
        set(draft, path, value)
      })
    })
  }

  return {
    get,
    bulkGet,
    getAll,
    use,
    useById,
    put,
    bulkPut,
    update,
    updateShallow,
    setByPath,
    unsetByPath,
    patchByPath,
    mutate,
    remove: deleteById,
    bulkDelete,
    clear,
    reset: clear,
    replaceAll,
    mergeMany,
    transaction
  }
}
