import { computed } from 'vue'

import { useLiveMediaUrl } from 'src/shared/lib'

import type { AppMediaImageProps } from './types'

export const useAppMediaImage = (props: AppMediaImageProps) => {
  const liveImageUrl = useLiveMediaUrl(() => props.mediaId)
  const imageSrc = computed(() => liveImageUrl.value || '')

  return {
    imageSrc
  }
}
