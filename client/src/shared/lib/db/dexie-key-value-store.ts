import type { Table } from 'dexie'
import set from 'lodash/set'
import { computed } from 'vue'

import { cloneMutable } from './helpers/clone-mutable'
import type { IndexableType, IUseStateResult, KvItem, MutableType, UseResult } from './types'
import { useDexieLiveQuery } from './use-dexie-live-query'

export const dexieKeyValueStore = <T extends object>(table: Table<KvItem<T>>, keyValue: string) => {
  const wrap = (data: T): KvItem<T> => ({ ...data, __key: keyValue })

  const unwrap = (data: KvItem<T> | undefined): T | undefined => {
    if (!data) return undefined

    const { __key: _key, ...value } = data

    return value as T
  }

  const get = async (): Promise<T | undefined> => {
    return unwrap(await table.get(keyValue as never))
  }

  const reset = async (defaults: T) => {
    await table.put(wrap(defaults))
  }

  const ensure = async (defaults: T) => {
    const exists = await table.get(keyValue as never)

    if (!exists) {
      await table.put(wrap(defaults))
    }
  }

  const mutate = async (mutator: (draft: MutableType<T>) => void) => {
    await table.db.transaction('rw', table, async () => {
      const current = unwrap(await table.get(keyValue as never))
      const base = current ?? ({} as T)
      const draft = cloneMutable(base)

      mutator(draft)
      await table.put(wrap(draft as T))
    })
  }

  const shallowUpdate = (changes: Partial<T>) =>
    mutate((data) => {
      Object.assign(data, changes)
    })

  const setByPath = (path: string, value: unknown) => {
    return mutate((data) => {
      set(data as unknown as IndexableType, path, value)
    })
  }

  const useState = <D extends Partial<T> | undefined = undefined>(defaults?: D): IUseStateResult<T, D> => {
    const state = useDexieLiveQuery(get, undefined)
    const data = computed(() => {
      if (!defaults) {
        return state.data.value as UseResult<T, D>
      }

      return { ...defaults, ...state.data.value } as UseResult<T, D>
    })

    return {
      data,
      isReady: state.isReady
    }
  }

  const use = <D extends Partial<T> | undefined = undefined>(defaults?: D) => useState(defaults).data

  return {
    get,
    use,
    useState,
    reset,
    ensure,
    mutate,
    shallowUpdate,
    setByPath
  }
}
