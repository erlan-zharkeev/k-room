import type { Table } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import set from 'lodash/set'
import unset from 'lodash/unset'

import type { MutableType, IndexableType } from 'src/shared/lib/db/config'

export const dexieKeyValueStore = <T extends object, L extends string = '__key'>(
  table: Table<T & Record<L, string>>,
  keyValue: string,
  keyField: L = '__key' as L
) => {
  type Item = T & Record<L, string>

  const get = (): Promise<Item | undefined> => table.get(keyValue as unknown as never)

  const put = async (data: T) => {
    const payload = { ...data, [keyField]: keyValue } as Item
    await table.put(payload)
  }

  const reset = async (defaults: T) => {
    const payload = { ...defaults, [keyField]: keyValue } as Item
    await table.put(payload)
  }

  const ensure = async (defaults: T) => {
    const exists = await table.get(keyValue as unknown as never)
    if (!exists) {
      const payload = { ...defaults, [keyField]: keyValue } as Item
      await table.put(payload)
    }
  }

  const mutate = async (mutator: (draft: MutableType<Item>) => void) => {
    await table.db.transaction('rw', table, async () => {
      const current = (await table.get(keyValue as unknown as never)) as Item | undefined
      const base: Item = current ?? ({ [keyField]: keyValue } as Item)
      const draft =
        typeof structuredClone === 'function'
          ? (structuredClone(base) as MutableType<Item>)
          : (JSON.parse(JSON.stringify(base)) as MutableType<Item>)
      mutator(draft)
      await table.put(draft as Item)
    })
  }

  const updateShallow = (changes: Partial<T>) =>
    mutate((obj) => {
      Object.assign(obj, changes)
    })

  const setByPath = (path: string, value: unknown) => mutate((obj) => set(obj as unknown as IndexableType, path, value))

  const unsetByPath = (path: string) => mutate((obj) => unset(obj as unknown as IndexableType, path))

  const patchByPath = (patch: Record<string, unknown>) =>
    mutate((obj) => {
      const target = obj as unknown as IndexableType
      for (const [p, v] of Object.entries(patch)) set(target, p, v)
    })

  const use = <D extends Partial<T> = T>(defaults?: D) =>
    useLiveQuery(
      async () => {
        const data = (await table.get(keyValue as unknown as never)) as Item | undefined
        if (!data) return defaults as D & T // после await, если записи нет
        const { [keyField]: _drop, ...rest } = data
        return (defaults ? { ...(defaults as object), ...rest } : (rest as unknown)) as D & T
      },
      [keyValue],
      defaults as D & T
    )
  return {
    get,
    use,
    put,
    reset,
    ensure,
    updateShallow,
    setByPath,
    unsetByPath,
    patchByPath
  }
}
