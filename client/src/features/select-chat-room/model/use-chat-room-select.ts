import { useContentTabSelect } from 'src/features/select-content-tab'

import { useSettings } from 'src/shared/preferences'

// import { useChatRoomScroll } from 'src/features/chat-room'

export const useChatRoomSelect = () => {
  const { selectContentTab } = useContentTabSelect()
  const settings = useSettings()
  // const { scrollToBottom } = useChatRoomScroll()

  const resetChatRoomSelection = () => {
    selectChatWithAsideById('')
  }

  const selectChatWithAsideById = (value?: string) => {
    if (value === undefined) return
    selectContentTab('chat-rooms')
    selectChatRoomById(value)
  }

  const selectChatRoomById = (value?: string) => {
    if (value === undefined) return
    settings.shallowUpdate({ selectedChatRoomId: value })
    // TODO Установить скролл из стора по текущему выбранному элементу
    // scrollToBottom()
  }

  return { selectChatRoomById, selectChatWithAsideById, resetChatRoomSelection }
}
