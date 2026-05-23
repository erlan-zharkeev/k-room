import { computed } from 'vue'

import { useLiveMediaUrl } from 'src/shared/lib'

import type { AppProfileBasicDataProps } from './types'

export const useAppProfileBasicData = (props: AppProfileBasicDataProps) => {
  const liveImageUrl = useLiveMediaUrl(() => props.imageId)
  const imageSrc = computed(() => props.imageSrc || liveImageUrl.value || '')

  return {
    imageSrc
  }
}
