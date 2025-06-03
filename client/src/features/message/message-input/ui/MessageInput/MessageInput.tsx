import './style.scss'

import { EmojiDropdown } from 'src/features/emoji-dropdown'
import { useMessageSend } from 'src/features/message'

import { useChatRooms } from 'src/entities/chat-room'

import { AppButton, AppFileLoader, AppInput } from 'src/shared/ui'

export const MessageInput = () => {
  const { selectedChatRoom } = useChatRooms()
  if (!selectedChatRoom?.id) return null

  const {
    onSendMessageFormSubmitHandler,
    onTypingMessage,
    setEmoji,
    onBlur,
    setImagesHandler,
    sendBtnDisabled,
    message,
    inputRef,
    images
  } = useMessageSend(selectedChatRoom)

  return (
    <form onSubmit={onSendMessageFormSubmitHandler} className="message-input">
      <AppFileLoader
        name="images"
        multiple={true}
        onChange={setImagesHandler}
        showTextLabel={false}
        value={images}
        showPreview={false}
      />
      <AppInput name="message" onChange={onTypingMessage} value={message} onBlur={onBlur} ref={inputRef} />
      <EmojiDropdown setEmoji={setEmoji} />
      <AppButton htmltype="submit" disabled={sendBtnDisabled} prefixIconName="send" borderless />
    </form>
  )
}
