import { NmorphIconChatLineSquare, NmorphIconStarFilled } from '@nmorph/nmorph-ui-kit'
import { computed, type Ref } from 'vue'

import type { ChatRoomContextMenuOption } from 'src/features/chat-room-context-menu'
import { RoomCallAudioContextMenuItem } from 'src/features/room-call-session'
import { useScreen } from 'src/shared/lib'

import type { ChatRoomNavigationItem } from '../config/types'

export const useChatRoomListItem = (item: Readonly<Ref<ChatRoomNavigationItem>>) => {
  const { isPortraitTabletOrLess } = useScreen()
  const isPressed = computed(() => item.value.selected && !isPortraitTabletOrLess.value)
  const avatarIcon = computed(() => {
    if (item.value.isFavoritesRoom) return NmorphIconStarFilled
    if (item.value.isSupportRoom) return NmorphIconChatLineSquare

    return undefined
  })
  const avatarIconColor = computed(() => {
    if (item.value.isFavoritesRoom) return 'var(--nmorph-warn-text-color)'
    if (item.value.isSupportRoom) return 'var(--nmorph-accent-color)'

    return undefined
  })
  const avatarIconSize = computed(() => {
    if (item.value.isFavoritesRoom) return '72%'
    if (item.value.isSupportRoom) return '72%'

    return undefined
  })
  const contextMenuActionOptions = computed<ChatRoomContextMenuOption[]>(() => {
    if (item.value.isFavoritesRoom || item.value.isSupportRoom) {
      return []
    }

    return [
      {
        value: 'audio-call',
        component: RoomCallAudioContextMenuItem,
        componentProps: {
          roomId: item.value.id
        },
        closeOnClick: false
      }
    ]
  })

  return {
    avatarIcon,
    avatarIconColor,
    avatarIconSize,
    contextMenuActionOptions,
    isPressed
  }
}
