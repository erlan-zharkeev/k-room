import { useDispatch } from 'react-redux'

import { showModal } from 'src/entities/system'

export const useOpenChatRoomSettingsModal = () => {
  const dispatch = useDispatch()

  const openChatRoomSettingsModal = () => {
    dispatch(
      showModal({
        title: 'Group Chat Info',
        modalContentComponentName: 'chat-room-settings-modal'
      })
    )
  }
  return { openChatRoomSettingsModal }
}
