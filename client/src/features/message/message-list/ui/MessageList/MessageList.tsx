import './style.scss'
import { IChatRoom } from 'common-types'

import { NoMessagesPlaceholder } from 'src/features/message'

import { AppScrollContainer } from 'src/shared/ui'

import { useMessageList } from '../../hooks/use-message-list'
import { MessageListEl } from '../MessageListEl/MessageListEl'

export const MessageList = ({ selectedChatRoom }: { selectedChatRoom: IChatRoom }) => {
  const { setRef } = useMessageList(selectedChatRoom)

  return (
    <AppScrollContainer additionalClassName="message-list" height="100%" id={selectedChatRoom.id}>
      <NoMessagesPlaceholder messages={selectedChatRoom.messages} />
      {selectedChatRoom.messages.map((messageId) => (
        <MessageListEl id={messageId} key={messageId} setRef={setRef} />
      ))}
    </AppScrollContainer>
  )
}
