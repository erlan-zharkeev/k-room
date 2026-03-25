import { useState } from 'react'

import { useI18n } from 'src/entities/system'

import { AppButton, AppModal } from 'src/shared/ui'

import { CreateChatRoomModal } from '../CreateChatRoomModal/CreateChatRoomModal'

import { CREATE_CHAT_ROOM_BTN_I18N } from './config'

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
