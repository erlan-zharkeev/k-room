import { useContentTabSelect } from 'src/features/content-tab'

import { useSettings } from 'src/entities/settings'

// import { useChatRoomScroll } from '../..'

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
    settings.update({ selectedChatRoomId: value })
    // TODO Установить скролл из стора по текущему выбранному элементу
    // scrollToBottom()
  }

  return { selectChatRoomById, selectChatWithAsideById, resetChatRoomSelection }
}
