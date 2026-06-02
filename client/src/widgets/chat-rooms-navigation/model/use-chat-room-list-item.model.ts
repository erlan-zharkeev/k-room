import { computed, type Ref } from 'vue'

import type { ChatRoomContextMenuOption } from 'src/features/chat-room-context-menu'
import { RoomCallAudioContextMenuItem } from 'src/features/room-call-session'
import { useScreen } from 'src/shared/lib'

import type { ChatRoomNavigationItem } from '../config/types'

export const useChatRoomListItem = (item: Readonly<Ref<ChatRoomNavigationItem>>) => {
  const { isPortraitTabletOrLess } = useScreen()
  const isPressed = computed(() => item.value.selected && !isPortraitTabletOrLess.value)
  const contextMenuActionOptions = computed<ChatRoomContextMenuOption[]>(() => [
    {
      value: 'audio-call',
      component: RoomCallAudioContextMenuItem,
      componentProps: {
        roomId: item.value.id
      },
      closeOnClick: false
    }
  ])

  return {
    contextMenuActionOptions,
    isPressed
  }
}
