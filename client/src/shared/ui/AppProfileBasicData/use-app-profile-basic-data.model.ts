import { computed } from 'vue'

import { useLiveMediaUrl } from 'src/shared/lib'

import type { IAppProfileBasicDataProps } from './types'

export const useAppProfileBasicData = (props: IAppProfileBasicDataProps) => {
  const liveImageUrl = useLiveMediaUrl(() => props.imageId)
  const imageSrc = computed(() => props.imageSrc || liveImageUrl.value || undefined)

  return {
    imageSrc
  }
}
