import type { NmorphCoordsType } from '@nmorph/nmorph-ui-kit'
import type { Virtualizer } from '@tanstack/vue-virtual'
import { nextTick, onBeforeUnmount, type Ref } from 'vue'

import { useSettings } from 'src/entities/setting'
import type { ChatRoomRecord } from 'src/shared/lib'

export const useChatRoomMessageScroll = (
  room: Ref<ChatRoomRecord>,
  messageVirtualizer: Ref<Virtualizer<HTMLElement, HTMLElement>>,
  scrollMessagesToBottom: () => Promise<void>
) => {
  const { settings, setByPath } = useSettings()

  const hasSavedMessagesScrollState = (roomId: string) => roomId in settings.value.messageScrollByRoom

  const saveMessagesScrollTop = async (roomId: string, scrollTop: number) => {
    if (!roomId) return

    const currentScrollTop = settings.value.messageScrollByRoom[roomId]
    const nextScrollTop = Math.trunc(scrollTop)
    const hasSameScrollTop = currentScrollTop === nextScrollTop

    if (hasSameScrollTop) return

    await setByPath(`messageScrollByRoom.${roomId}`, nextScrollTop)
  }

  const saveMessagesScrollState = ({ y }: NmorphCoordsType) => {
    void saveMessagesScrollTop(room.value.id, y)
  }

  const saveCurrentMessagesScrollState = (roomId = room.value.id) => {
    const scrollTop = messageVirtualizer.value.scrollOffset

    if (scrollTop === null) return

    void saveMessagesScrollTop(roomId, scrollTop)
  }

  const restoreMessagesScrollState = async (roomId = room.value.id) => {
    if (!hasSavedMessagesScrollState(roomId)) return false

    await nextTick()

    const scrollTop = settings.value.messageScrollByRoom[roomId]

    messageVirtualizer.value.scrollToOffset(scrollTop, { behavior: 'auto' })

    return true
  }

  const scrollMessagesToInitialPosition = async (roomId: string) => {
    if (hasSavedMessagesScrollState(roomId)) {
      await restoreMessagesScrollState(roomId)
      return
    }

    await scrollMessagesToBottom()
  }

  onBeforeUnmount(saveCurrentMessagesScrollState)

  return {
    saveCurrentMessagesScrollState,
    saveMessagesScrollState,
    scrollMessagesToInitialPosition
  }
}
