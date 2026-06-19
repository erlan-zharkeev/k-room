import { liveQuery } from 'dexie'
import { getCurrentScope, onScopeDispose, shallowRef, type Ref } from 'vue'

import type { DexieLiveQueryHandlers } from './types'

export const useDexieLiveQuery = <T>(query: () => Promise<T> | T, initialValue: T) => {
  const data = shallowRef(initialValue) as Ref<T>
  const isReady = shallowRef(false)
  const subscription = liveQuery(query).subscribe({
    next: (value) => {
      data.value = value
      isReady.value = true
    },
    error: () => {
      isReady.value = true
    }
  })

  if (getCurrentScope()) {
    onScopeDispose(() => {
      subscription.unsubscribe()
    })
  }

  return {
    data,
    isReady
  }
}

export const subscribeDexieLiveQuery = <T>(query: () => Promise<T> | T, handlers: DexieLiveQueryHandlers<T>) => {
  const subscription = liveQuery(query).subscribe({
    next: handlers.next,
    error: handlers.error
  })

  return () => subscription.unsubscribe()
}
