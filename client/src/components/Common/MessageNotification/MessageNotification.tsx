import { Message } from 'common-types'

export const MessageNotification = (message: Message) => {
  return (
    <>
      <p>{message.authorName}</p>
      <p>{message.body}</p>
    </>
  )
}
