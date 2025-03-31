import { IMessage } from 'common-types'

export const MessageNotification = (message: IMessage) => {
  return (
    <>
      <p>{message.authorName}</p>
      <p>{message.body}</p>
    </>
  )
}
