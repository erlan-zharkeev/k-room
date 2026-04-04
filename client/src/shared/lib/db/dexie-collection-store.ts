import { Table, TransactionMode } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import set from 'lodash/set'
import unset from 'lodash/unset'

import { IndexableType, MutableType } from 'src/shared/lib'

import { cloneMutable } from './lib'

export const dexieCollectionStore = <T extends { id: string | number }>(table: Table<T>) => {
  type Item = T
  type ItemId = Item['id']

  const get = (id: ItemId): Promise<Item | undefined> => table.get(id as never)

  const bulkGet = (ids: readonly ItemId[]): Promise<(Item | undefined)[]> => {
    return table.bulkGet(ids as never[])
  }

  const getAll = (): Promise<Item[]> => table.toArray()

  const use = (defaults: Item[] = []) => useLiveQuery(async () => await getAll(), [], defaults)

  const useById = <D = Item | undefined>(id: ItemId | null | undefined, defaults?: D) =>
    useLiveQuery(
      async () => {
        if (id == null) return defaults as D
        return ((await get(id)) as D | undefined) ?? defaults
      },
      [id],
      defaults as D
    )

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

  const clear = async () => {
    await table.clear()
  }

  const transaction = async <R>(mode: TransactionMode, callback: () => Promise<R> | R) => {
    return await table.db.transaction(mode, table, callback)
  }

  const replaceAll = async (data: readonly Item[]) => {
    await transaction('rw', async () => {
      await clear()
      await bulkPut(data)
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

  const patchByPath = async (id: ItemId, patch: Record<string, unknown>) => {
    await mutate(id, (draft) => {
      const target = draft as unknown as IndexableType

      for (const [path, value] of Object.entries(patch)) {
        set(target, path, value)
      }
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
    delete: deleteById,
    clear,
    reset: clear,
    replaceAll,
    transaction
  }
}
