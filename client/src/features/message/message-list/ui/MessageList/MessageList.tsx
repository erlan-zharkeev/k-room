import './style.scss'
import { IChatRoom } from 'common-types'

import { NoMessagesPlaceholder } from 'src/features/message'

import { AppScrollContainer } from 'src/shared/ui'

import { MessageListEl } from '../MessageListEl/MessageListEl'

export const MessageList = ({ selectedChatRoom }: { selectedChatRoom: IChatRoom }) => {
  // const { messages, setRef } = useMessageList(selectedChatRoom)

  return (
    <AppScrollContainer additionalClassName="message-list" height="100%" id={selectedChatRoom.id}>
      <NoMessagesPlaceholder messages={selectedChatRoom.messages} />
      {selectedChatRoom.messages.map((messageId) => (
        <MessageListEl id={messageId} key={messageId} />
      ))}
    </AppScrollContainer>
  )
}
