import './style.scss'

import { useState } from 'react'

import { useContactTyping } from 'src/features/contact'
import { EmojiDropdown } from 'src/features/emoji-dropdown'
import { MessageWithBindDataModal, useMessageSend } from 'src/features/message'

import { AppButton, AppForm } from 'src/shared/ui'

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
              placeholder: 'Type message',
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
      {!insideModal && <MessageWithBindDataModal open={isModalOpen} onClose={() => setIsModalOpen(false)} roomId={roomId} />}
    </>
  )
}
