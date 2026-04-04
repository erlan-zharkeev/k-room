import { Table } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import set from 'lodash/set'

import { MutableType, IndexableType, KvItem, KvQueryState, UseResult, UseStateResult } from './config'
import { cloneMutable } from './lib'

export const dexieKeyValueStore = <T extends object>(table: Table<KvItem<T>>, keyValue: string) => {
  const wrap = (data: T): KvItem<T> => ({ ...data, __key: keyValue })

  const unwrap = (data: KvItem<T> | undefined): T | undefined => {
    if (!data) return undefined

    const { __key: _drop, ...value } = data

    return value as T
  }

  const get = async (): Promise<T | undefined> => {
    return unwrap(await table.get(keyValue as unknown as never))
  }

  const reset = async (defaults: T) => {
    await table.put(wrap(defaults))
  }

  const ensure = async (defaults: T) => {
    const exists = await table.get(keyValue as unknown as never)
    if (!exists) {
      await table.put(wrap(defaults))
    }
  }

  const mutate = async (mutator: (draft: MutableType<T>) => void) => {
    await table.db.transaction('rw', table, async () => {
      const current = unwrap(await table.get(keyValue as unknown as never))
      const base = current ?? ({} as T)
      const draft = cloneMutable(base)
      mutator(draft)
      await table.put(wrap(draft as T))
    })
  }

  const update = (changes: Partial<T>) =>
    mutate((obj) => {
      Object.assign(obj, changes)
    })

  const setByPath = (path: string, value: unknown) => mutate((obj) => set(obj as unknown as IndexableType, path, value))

  const useQueryState = () => {
    return useLiveQuery<KvQueryState<T> | undefined>(async () => {
      return {
        data: await get(),
        isReady: true
      }
    }, [keyValue])
  }

  const use = <D extends Partial<T> | undefined = undefined>(defaults?: D): UseResult<T, D> => {
    const state = useQueryState()
    const data = state?.data

    if (!data) {
      return defaults as UseResult<T, D>
    }

    if (!defaults) {
      return data as UseResult<T, D>
    }

    return { ...defaults, ...data } as UseResult<T, D>
  }

  const useState = <D extends Partial<T> | undefined = undefined>(defaults?: D): UseStateResult<T, D> => {
    const state = useQueryState()
    const entry = state?.data

    if (!state?.isReady) {
      return {
        data: defaults as UseResult<T, D>,
        isReady: false
      }
    }

    if (!defaults) {
      return {
        data: entry as UseResult<T, D>,
        isReady: true
      }
    }

    return {
      data: { ...defaults, ...entry } as UseResult<T, D>,
      isReady: true
    }
  }

  return {
    get,
    use,
    useState,
    reset,
    ensure,
    update,
    setByPath
  }
}
