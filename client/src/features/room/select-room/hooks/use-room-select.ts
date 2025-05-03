import { useDispatch } from 'react-redux'

import { saveUserSetting } from 'src/features/settings'

import { selectChatRoom } from 'src/entities/settings'

export const useRoomSelect = () => {
  const dispatch = useDispatch()

  const selectRoomById = (value: string | undefined) => {
    if (value === undefined) return
    dispatch(selectChatRoom(value))
    saveUserSetting({ type: 'selectedChatRoomId', value })
    // scrollToBottom()
  }

  const resetRoomSelection = () => {
    dispatch(selectChatRoom(''))
  }

  return { selectRoomById, resetRoomSelection }
}
