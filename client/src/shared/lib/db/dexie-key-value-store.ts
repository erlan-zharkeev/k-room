import type { Table } from 'dexie'
import set from 'lodash/set'
import { computed } from 'vue'

import { cloneMutable } from './clone-mutable'
import type { IUseStateResult, KvItem, MutableType, UseResult } from './types'
import { useDexieLiveQuery } from './use-dexie-live-query'

export const dexieKeyValueStore = <T extends object>(table: Table<KvItem<T>>, keyValue: string) => {
  let cached: T | undefined
  let isCached = false

  const wrap = (data: T): KvItem<T> => ({ ...data, __key: keyValue })

  const unwrap = (data: KvItem<T> | undefined): T | undefined => {
    if (!data) return undefined

    const { __key: _key, ...value } = data

    return value as T
  }

  const get = async (): Promise<T | undefined> => {
    cached = unwrap(await table.get(keyValue as never))
    isCached = true

    return cached
  }

  const reset = async (defaults: T) => {
    await table.put(wrap(defaults))
    cached = defaults
    isCached = true
  }

  const ensure = async (defaults: T) => {
    const exists = await table.get(keyValue as never)

    if (!exists) {
      await table.put(wrap(defaults))
      cached = defaults
      isCached = true
      return
    }

    cached = unwrap(exists)
    isCached = true
  }

  const mutate = async (mutator: (draft: MutableType<T>) => void) => {
    let nextValue: T | undefined

    await table.db.transaction('rw', table, async () => {
      const current = unwrap(await table.get(keyValue as never))
      const base = current ?? ({} as T)
      const draft = cloneMutable(base)

      mutator(draft)
      nextValue = draft as T
      await table.put(wrap(nextValue))
    })

    cached = nextValue
    isCached = true
  }

  const shallowUpdate = (changes: Partial<T>) =>
    mutate((data) => {
      Object.assign(data, changes)
    })

  const setByPath = (path: string, value: unknown) => {
    return mutate((data) => {
      set(data, path, value)
    })
  }

  const useState = <D extends Partial<T> | undefined = undefined>(defaults?: D): IUseStateResult<T, D> => {
    const state = useDexieLiveQuery(get, isCached ? cached : undefined)
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
