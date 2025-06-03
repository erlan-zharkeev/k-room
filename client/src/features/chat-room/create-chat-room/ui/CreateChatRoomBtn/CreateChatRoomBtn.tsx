import { useDispatch } from 'react-redux'

import { showModal } from 'src/entities/system'

import { AppButton } from 'src/shared/ui'

export const CreateChatRoomBtn = () => {
  const dispatch = useDispatch()

  const createMultipleChat = () => {
    dispatch(
      showModal({
        title: 'Create chat room',
        modalContentComponentName: 'create-chat-room-modal'
      })
    )
  }

  return <AppButton text="Create chat" fill onClick={createMultipleChat} />
}
