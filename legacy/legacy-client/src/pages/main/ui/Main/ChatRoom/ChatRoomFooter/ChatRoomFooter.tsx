import './style.scss'

import { useState } from 'react'

import { useDispatch } from 'react-redux'

import { useI18n } from 'src/shared/preferences'
import { removeImageByNameFromMessageInputData, useSystem } from 'src/shared/system'
import { AppButton, AppForm, AppImagePreview, AppModal } from 'src/shared/ui'

import { EmojiDropdown } from './EmojiDropdown/EmojiDropdown'
import { CHAT_ROOM_FOOTER_I18N } from './i18n.ts'
import { ChatRoomFooterProps } from './types'
import { useContactTyping } from './use-contact-typing'
import { useMessageSend } from './use-message-send'

const MessageWithBindDataModal = ({
  open,
  onClose,
  roomId
}: {
  open: boolean
  onClose: () => void
  roomId: string
}) => {
  const { messageInputData } = useSystem()
  const { images } = messageInputData
  const dispatch = useDispatch()
  const { t } = useI18n()

  return (
    <AppModal title={t(CHAT_ROOM_FOOTER_I18N.modalTitle)} open={open} onClose={onClose}>
      <div className="message-with-bind-data-modal">
        <AppImagePreview
          images={images}
          removeImage={(name) => dispatch(removeImageByNameFromMessageInputData(name))}
        />
        <ComposerInput roomId={roomId} emitTypingStatus={false} insideModal onSubmitSuccess={onClose} />
      </div>
    </AppModal>
  )
}

const ComposerInput = ({
  roomId,
  emitTypingStatus = true,
  insideModal = false,
  onSubmitSuccess
}: {
  roomId: string
  emitTypingStatus?: boolean
  insideModal?: boolean
  onSubmitSuccess?: () => void
}) => {
  const { sendUserTypingStatus, debouncedChangeTypeStatus } = useContactTyping()
  const { body, inputBodyRef, images, setBody, setEmoji, onSendMessageFormSubmitHandler, setImages } = useMessageSend()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { t } = useI18n()

  return (
    <>
      <div className="message-input">
        <AppForm
          onSubmit={() => {
            onSendMessageFormSubmitHandler(roomId)
            if (insideModal) onSubmitSuccess?.()
          }}
          onBlur={() => {
            if (!emitTypingStatus) return
            sendUserTypingStatus(false)
          }}
          fields={{
            images: {
              multiple: true,
              value: images,
              inputType: 'file',
              showPreview: false,
              showTextLabel: false,
              onChange: (fieldData) => {
                setImages(fieldData.value)
                if (!insideModal) setIsModalOpen(true)
              }
            },
            body: {
              value: body,
              inputType: 'text',
              placeholder: t(CHAT_ROOM_FOOTER_I18N.placeholder),
              ref: inputBodyRef,
              onChange: (e) => {
                setBody(e.target.value)
                if (!emitTypingStatus) return
                debouncedChangeTypeStatus(false)
              }
            }
          }}
        >
          <EmojiDropdown setEmoji={setEmoji} />
          <AppButton htmltype="submit" prefixIconName="send" borderless />
        </AppForm>
      </div>
      {!insideModal && (
        <MessageWithBindDataModal open={isModalOpen} onClose={() => setIsModalOpen(false)} roomId={roomId} />
      )}
    </>
  )
}

export const ChatRoomFooter = ({ roomId, prependChildren }: ChatRoomFooterProps) => {
  return (
    <div className="chat-room-footer">
      {prependChildren}
      <ComposerInput roomId={roomId} />
    </div>
  )
}
