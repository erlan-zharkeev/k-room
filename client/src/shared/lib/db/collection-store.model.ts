import type { Table, TransactionMode } from 'dexie'
import type { UnknownObject } from 'global-shared'
import set from 'lodash/set'
import unset from 'lodash/unset'
import { computed } from 'vue'

import { runDexieCacheTrimGuard } from './cache-trim'
import { useDexieLiveQuery } from './live-query.model'
import { cloneMutable } from './mutable'
import type {
  CollectionBulkUpdateItem,
  CollectionIncomingItem,
  CollectionMergeManyOptions,
  DbCollectionItem,
  Mutable
} from './types'

const collectionInitializers = new Set<() => Promise<void>>()

export const initializeDexieCollectionStores = async () => {
  await Promise.all([...collectionInitializers].map((initialize) => initialize()))
}

export const dexieCollectionStore = <T extends DbCollectionItem>(table: Table<T>) => {
  let cachedItems: T[] | undefined

  const updateCachedItems = (items: readonly T[]) => {
    if (!cachedItems) return

    const itemById = new Map(cachedItems.map((item) => [item.id, item]))

    items.forEach((item) => {
      itemById.set(item.id, item)
    })
    cachedItems = [...itemById.values()]
  }

  const removeCachedItems = (ids: readonly T['id'][]) => {
    if (!cachedItems) return

    const idSet = new Set(ids)

    cachedItems = cachedItems.filter(({ id }) => !idSet.has(id))
  }

  const get = (id: T['id']): Promise<T | undefined> => table.get(id as never)

  const bulkGet = (ids: readonly T['id'][]): Promise<(T | undefined)[]> => table.bulkGet(ids as never[])

  const getAll = async (): Promise<T[]> => {
    cachedItems = await table.toArray()

    return cachedItems
  }

  const initialize = async () => {
    await getAll()
  }

  collectionInitializers.add(initialize)

  const use = (defaults: T[] = []) => useDexieLiveQuery(getAll, cachedItems ?? defaults).data

  const useIndexedList = (defaults: T[] = []) => {
    const items = use(defaults)
    const itemMap = computed(() => new Map<T['id'], T>(items.value.map((item) => [item.id, item])))
    const hasById = (id: T['id']) => itemMap.value.has(id)

    return {
      items,
      itemMap,
      hasById
    }
  }

  const useById = <D = T | undefined>(id?: T['id'] | null, defaults?: D) => {
    const initialValue =
      id == null ? defaults : (cachedItems?.find((item) => item.id === id) as D | undefined) ?? defaults

    return useDexieLiveQuery(async () => {
      if (id == null) return defaults as D

      return ((await get(id)) as D | undefined) ?? (defaults as D)
    }, initialValue as D).data
  }

  const put = async (data: T) => {
    await runDexieCacheTrimGuard(() => table.put(data))
    updateCachedItems([data])
  }

  const bulkPut = async (data: readonly T[]) => {
    if (!data.length) return

    await runDexieCacheTrimGuard(() => table.bulkPut(data as T[]))
    updateCachedItems(data)
  }

  const update = async (id: T['id'], changes: Partial<T>) => {
    const updated = await runDexieCacheTrimGuard(() => table.update(id as never, changes as never))

    if (updated && cachedItems) {
      cachedItems = cachedItems.map((item) => (item.id === id ? ({ ...item, ...changes } as T) : item))
    }

    return updated
  }

  const bulkUpdate = async (data: readonly CollectionBulkUpdateItem<T>[]) => {
    if (!data.length) return 0

    const updated = await runDexieCacheTrimGuard(() =>
      table.bulkUpdate(
        data.map(({ id, changes }) => ({
          key: id as never,
          changes: changes as never
        }))
      )
    )

    if (updated && cachedItems) {
      const changesById = new Map<T['id'], Partial<T>>(data.map(({ id, changes }) => [id, changes]))

      cachedItems = cachedItems.map((item) => {
        const changes = changesById.get(item.id)

        return changes ? ({ ...item, ...changes } as T) : item
      })
    }

    return updated
  }

  const deleteById = async (id: T['id']) => {
    await runDexieCacheTrimGuard(() => table.delete(id as never))
    removeCachedItems([id])
  }

  const bulkDelete = async (ids: readonly T['id'][]) => {
    if (!ids.length) return

    await runDexieCacheTrimGuard(() => table.bulkDelete(ids as never[]))
    removeCachedItems(ids)
  }

  const clear = async () => {
    await runDexieCacheTrimGuard(() => table.clear())
    cachedItems = []
  }

  const transaction = async <R>(mode: TransactionMode, callback: () => Promise<R> | R) => {
    return runDexieCacheTrimGuard(() => table.db.transaction(mode, table, callback))
  }

  const replaceAll = async (data: readonly T[]) => {
    await transaction('rw', async () => {
      await table.clear()

      if (data.length) {
        await table.bulkPut(data as T[])
      }
    })
    cachedItems = [...data]
  }

  const mergeMany = async <Incoming extends CollectionIncomingItem<T['id']>>(
    data: readonly Incoming[],
    options: CollectionMergeManyOptions<T, Incoming>
  ) => {
    const { merge, removeMissing = false } = options
    const shouldRefreshCache = Boolean(cachedItems)

    await transaction('rw', async () => {
      if (!data.length) {
        if (removeMissing) {
          const existingItems = await table.toArray()
          const idsToDelete = existingItems.map(({ id }) => id)

          if (idsToDelete.length) {
            await table.bulkDelete(idsToDelete as never[])
          }
        }

        return
      }

      const incomingIds = data.map((item) => item.id)
      const existingItems = removeMissing ? await table.toArray() : await bulkGet(incomingIds)
      const existingMap = new Map<T['id'], T>()

      existingItems.forEach((item) => {
        if (item) {
          existingMap.set(item.id as T['id'], item)
        }
      })

      const nextItems: T[] = []

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

  const mutate = async (id: T['id'], mutator: (draft: Mutable<T>) => void) => {
    let nextItem: T | undefined

    await transaction('rw', async () => {
      const current = await get(id)

      if (!current) return

      const draft = cloneMutable(current)

      mutator(draft)
      nextItem = draft as T
      await table.put(nextItem)
    })

    if (nextItem) {
      updateCachedItems([nextItem])
    }
  }

  const updateShallow = async (id: T['id'], changes: Partial<T>) => {
    await mutate(id, (draft) => {
      Object.assign(draft, changes)
    })
  }

  const setByPath = async (id: T['id'], path: string, value: unknown) => {
    await mutate(id, (draft) => {
      set(draft, path, value)
    })
  }

  const unsetByPath = async (id: T['id'], path: string) => {
    await mutate(id, (draft) => {
      unset(draft, path)
    })
  }

  const patchByPath = async (id: T['id'], patch: UnknownObject) => {
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
    useIndexedList,
    useById,
    put,
    bulkPut,
    update,
    bulkUpdate,
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
