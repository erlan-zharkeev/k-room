import { useState } from 'react'

import { CREATE_CHAT_ROOM_BTN_I18N, CreateChatRoomModal } from 'src/features/chat-room'

import { useI18n } from 'src/entities/settings'

import { AppButton, AppModal } from 'src/shared/ui'

export const CreateChatRoomBtn = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useI18n()

  return (
    <>
      <AppButton text={t(CREATE_CHAT_ROOM_BTN_I18N.button)} fill onClick={() => setIsOpen(true)} />
      <AppModal title={t(CREATE_CHAT_ROOM_BTN_I18N.modalTitle)} open={isOpen} onClose={() => setIsOpen(false)}>
        <CreateChatRoomModal onSuccess={() => setIsOpen(false)} />
      </AppModal>
    </>
  )
}
