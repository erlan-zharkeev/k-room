import { liveQuery } from 'dexie'
import { getCurrentScope, onScopeDispose, shallowRef, type Ref } from 'vue'

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
