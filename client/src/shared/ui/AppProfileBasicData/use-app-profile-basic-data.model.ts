import { computed } from 'vue'

import { useLiveMediaUrl } from 'src/shared/lib'

import { APP_PROFILE_BASIC_DATA_DEFAULT_PROPS } from './constants'
import type { AppProfileBasicDataProps } from './types'

export const useAppProfileBasicData = (props: AppProfileBasicDataProps) => {
  const liveImageUrl = useLiveMediaUrl(() => props.imageId)
  const imageSrc = computed(() => props.imageSrc || liveImageUrl.value || '')
  const avatarIconSize = computed(() => props.avatarSize ?? APP_PROFILE_BASIC_DATA_DEFAULT_PROPS.avatarSize)
  const avatarIconStyle = computed(() => ({
    height: `${avatarIconSize.value}px`,
    width: `${avatarIconSize.value}px`
  }))

  return {
    avatarIconStyle,
    imageSrc
  }
}
