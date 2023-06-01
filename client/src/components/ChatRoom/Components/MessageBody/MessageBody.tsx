import moment from 'moment'
import { MessageBodyProps } from './@types/MessageBodyProps'
import { setContextMenu } from 'src/store/systemSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'

export const MessageBody = ({ message }: MessageBodyProps) => {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div
      className={`message message--${message.status}`}
      message-id={message.id}
      onContextMenu={(e) => dispatch(setContextMenu({ event: e, type: 'message', contextClickedObject: { message } }))}
    >
      <div className="message__text">{message.body}</div>
      <div className="message__system-info">
        {message.isSelf && <div className="message__status" />}
        <div className="paragraph-text paragraph-text--secondary paragraph-text--sm">
          {moment(Number(message.createdAt)).format('HH:mm')}
        </div>
      </div>
    </div>
  )
}
export default MessageBody
