import moment from 'moment'
import { MessageBodyProps } from './@types/MessageBodyProps'

export const MessageBody = ({ message }: MessageBodyProps) => {
  return (
    <div className={`message message--${message.status}`} message-id={message.id}>
      <div className="message__text">{message.body}</div>
      <div className="message__system-info">
        {message.isSelf === true && <div className="message__status" />}
        <div className="paragraph-text paragraph-text--secondary paragraph-text--sm">
          {moment(Number(message.createdAt)).format('hh:mm')}
        </div>
      </div>
    </div>
  )
}
export default MessageBody
