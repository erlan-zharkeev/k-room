import { useDispatch } from 'react-redux'

import { useContentTabSelect } from 'src/features/content-tab/select-content-tab'
import { saveUserSetting } from 'src/features/settings'

import { selectChatRoom } from 'src/entities/settings'

export const useChatRoomSelect = () => {
  const dispatch = useDispatch()
  const { selectContentTab } = useContentTabSelect()

  const selectChatWithAsideById = (value: string | undefined) => {
    if (value === undefined) return
    selectContentTab('chat-rooms')
    selectChatRoomById(value)
  }

  const selectChatRoomById = (value: string | undefined) => {
    if (value === undefined) return
    dispatch(selectChatRoom(value))
    saveUserSetting({ type: 'selectedChatRoomId', value })
    // scrollToBottom()
  }

  return { selectChatRoomById, selectChatWithAsideById }
}
