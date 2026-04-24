import type { Table } from 'dexie'
import set from 'lodash/set'
import unset from 'lodash/unset'

import { cloneMutable } from './helpers/clone-mutable'
import type { DbTransactionModeType, ICollectionMergeManyOptions, IndexableType, MutableType } from './types'
import { useDexieLiveQuery } from './use-dexie-live-query'

export const dexieCollectionStore = <T extends { id: string | number }>(table: Table<T>) => {
  type Item = T
  type ItemId = Item['id']

  const get = (id: ItemId): Promise<Item | undefined> => table.get(id as never)

  const bulkGet = (ids: readonly ItemId[]): Promise<(Item | undefined)[]> => table.bulkGet(ids as never[])

  const getAll = (): Promise<Item[]> => table.toArray()

  const use = (defaults: Item[] = []) => useDexieLiveQuery(getAll, defaults).data

  const useById = <D = Item | undefined>(id: ItemId | null | undefined, defaults?: D) => {
    return useDexieLiveQuery(async () => {
      if (id == null) return defaults as D

      return ((await get(id)) as D | undefined) ?? (defaults as D)
    }, defaults as D).data
  }

  const put = async (data: Item) => {
    await table.put(data)
  }

  const bulkPut = async (data: readonly Item[]) => {
    if (!data.length) return

    await table.bulkPut(data as Item[])
  }

  const update = (id: ItemId, changes: Partial<Item>) => table.update(id as never, changes as never)

  const deleteById = async (id: ItemId) => {
    await table.delete(id as never)
  }

  const bulkDelete = async (ids: readonly ItemId[]) => {
    if (!ids.length) return

    await table.bulkDelete(ids as never[])
  }

  const clear = async () => {
    await table.clear()
  }

  const transaction = async <R>(mode: DbTransactionModeType, callback: () => Promise<R> | R) => {
    return table.db.transaction(mode, table, callback)
  }

  const replaceAll = async (data: readonly Item[]) => {
    await transaction('rw', async () => {
      await clear()
      await bulkPut(data)
    })
  }

  const mergeMany = async <Incoming extends { id: ItemId }>(
    data: readonly Incoming[],
    options: ICollectionMergeManyOptions<Item, Incoming>
  ) => {
    const { merge, removeMissing = false } = options

    await transaction('rw', async () => {
      if (!data.length) {
        if (removeMissing) {
          await clear()
        }

        return
      }

      const incomingIds = data.map((item) => item.id)
      const existingItems = removeMissing ? await getAll() : await bulkGet(incomingIds)
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

      await bulkPut(nextItems)

      if (removeMissing) {
        const incomingIdSet = new Set(incomingIds)
        const idsToDelete = [...existingMap.keys()].filter((id) => !incomingIdSet.has(id))

        await bulkDelete(idsToDelete)
      }
    })
  }

  const mutate = async (id: ItemId, mutator: (draft: MutableType<Item>) => void) => {
    await transaction('rw', async () => {
      const current = await get(id)

      if (!current) return

      const draft = cloneMutable(current)

      mutator(draft)
      await put(draft as Item)
    })
  }

  const updateShallow = async (id: ItemId, changes: Partial<Item>) => {
    await mutate(id, (draft) => {
      Object.assign(draft, changes)
    })
  }

  const setByPath = async (id: ItemId, path: string, value: unknown) => {
    await mutate(id, (draft) => {
      set(draft as unknown as IndexableType, path, value)
    })
  }

  const unsetByPath = async (id: ItemId, path: string) => {
    await mutate(id, (draft) => {
      unset(draft as unknown as IndexableType, path)
    })
  }

  const patchByPath = async (id: ItemId, patch: IndexableType) => {
    await mutate(id, (draft) => {
      const target = draft as unknown as IndexableType

      Object.entries(patch).forEach(([path, value]) => {
        set(target, path, value)
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
