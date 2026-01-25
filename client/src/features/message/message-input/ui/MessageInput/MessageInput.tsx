import './style.scss'

import { useContactTyping } from 'src/features/contact'
import { EmojiDropdown } from 'src/features/emoji-dropdown'
import { useMessageSend } from 'src/features/message'

import { useChatRoom } from 'src/entities/chat-room'

import { FileLoaderValueType } from 'src/shared/config'
import { AppButton, AppForm } from 'src/shared/ui'

export const MessageInput = () => {
  const chatRoomData = useChatRoom()

  if (!chatRoomData) return null

  const { body, inputBodyRef, images, setBody, setEmoji, onSendMessageFormSubmitHandler, setImages } = useMessageSend()

  const { sendUserTypingStatus, debouncedChangeTypeStatus } = useContactTyping()

  return (
    <div className="message-input">
      <AppForm
        onSubmit={() => {
          const roomId = chatRoomData.selectedChatRoom?.id as string
          onSendMessageFormSubmitHandler(roomId)
        }}
        onBlur={() => {
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
              setImages(fieldData.value as FileLoaderValueType)
            }
          },
          body: {
            value: body,
            inputType: 'text',
            placeholder: 'Type message',
            ref: inputBodyRef,
            onChange: (e) => {
              setBody(e.target.value as string)
              debouncedChangeTypeStatus(false)
            }
          }
        }}
      >
        <EmojiDropdown setEmoji={setEmoji} />
        <AppButton htmltype="submit" prefixIconName="send" borderless />
      </AppForm>
    </div>
  )
}
