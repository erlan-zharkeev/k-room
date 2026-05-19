import { computed } from 'vue'

import { getAvatarId, useLiveMediaUrl } from 'src/shared/lib'

import type { ICreateChatRoomContactItemProps } from '../config/types'

export const useCreateChatRoomContactItem = (props: ICreateChatRoomContactItemProps) => {
  const avatarId = computed(() => getAvatarId(props.contactId))
  const avatarSrc = useLiveMediaUrl(avatarId)

  return {
    avatarSrc
  }
}
