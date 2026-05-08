import { liveQuery } from 'dexie'
import { computed, ref, watch } from 'vue'

import { db } from 'src/shared/lib'

import type { IAppProfileBasicDataProps } from './types'

export const useAppProfileBasicData = (props: IAppProfileBasicDataProps) => {
  const liveImageUrl = ref('')
  const imageSrc = computed(() => props.imageSrc || liveImageUrl.value || undefined)

  const clearLiveImageUrl = () => {
    if (liveImageUrl.value) {
      URL.revokeObjectURL(liveImageUrl.value)
      liveImageUrl.value = ''
    }
  }

  watch(
    () => props.imageId,
    (imageId, _previous, onCleanup) => {
      clearLiveImageUrl()

      if (!imageId) return

      const subscription = liveQuery(() => db.media.get(imageId)).subscribe({
        next: (record) => {
          clearLiveImageUrl()

          if (record?.blob) {
            liveImageUrl.value = URL.createObjectURL(record.blob)
          }
        },
        error: clearLiveImageUrl
      })

      onCleanup(() => {
        subscription.unsubscribe()
        clearLiveImageUrl()
      })
    },
    { immediate: true }
  )

  return {
    imageSrc
  }
}
