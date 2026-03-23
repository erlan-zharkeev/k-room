import { useState } from 'react'

import { AppButton, AppModal } from 'src/shared/ui'

import { CreateChatRoomModal } from '../CreateChatRoomModal/CreateChatRoomModal'

export const CreateChatRoomBtn = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <AppButton text="Create chat" fill onClick={() => setIsOpen(true)} />
      <AppModal title="Create chat room" open={isOpen} onClose={() => setIsOpen(false)}>
        <CreateChatRoomModal onSuccess={() => setIsOpen(false)} />
      </AppModal>
    </>
  )
}
