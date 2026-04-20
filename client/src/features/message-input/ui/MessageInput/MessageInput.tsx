import './style.scss'

import { useState } from 'react'

import { useContactTyping } from 'src/features/contact-typing'
import { MESSAGE_INPUT_I18N } from 'src/features/message-input'
import { useMessageSend } from 'src/features/send-message'
import { MessageWithBindDataModal } from 'src/features/send-message-with-bind-data'

import { useI18n } from 'src/shared/preferences'
import { AppButton, AppForm } from 'src/shared/ui'

import { EmojiDropdown } from '../EmojiDropdown'

export const MessageInput = ({
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
              placeholder: t(MESSAGE_INPUT_I18N.placeholder),
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
