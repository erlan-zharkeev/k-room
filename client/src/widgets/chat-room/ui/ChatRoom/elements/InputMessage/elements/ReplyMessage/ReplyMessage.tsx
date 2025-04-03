import './style.scss'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from 'src/shared/lib'
import { AppIcon } from 'src/shared/ui'
import { AppDispatch } from 'src/app/store'
import { resetRepliedMessage } from 'src/entities/chat-room'
import { resetContextClickedObject } from 'src/entities/system'
import { FULL_INPUT_MESSAGE_HEIGHT, SHORT_INPUT_MESSAGE_HEIGHT } from 'src/entities/message'

export const ReplyMessage = () => {
  const { repliedMessageData } = useTypedSelector((state) => state.chatRooms)

  const [height, setHeight] = useState(0)

  useEffect(() => {
    const updatedHeight = repliedMessageData.id ? FULL_INPUT_MESSAGE_HEIGHT - SHORT_INPUT_MESSAGE_HEIGHT - 8 : 0
    setHeight(updatedHeight)
  }, [repliedMessageData])

  const dispatch = useDispatch<AppDispatch>()
  const closeReplyMessage = () => {
    dispatch(resetContextClickedObject())
    dispatch(resetRepliedMessage())
  }
  return (
    <div
      className="reply-message"
      style={{
        height: `${height}px`,
        display: height ? 'flex' : 'none'
      }}
    >
      <div className="reply-message__icon">
        <AppIcon name="reply" color="accent-color" />
      </div>
      <div className="reply-message__content">
        <div className="reply-message__author">{repliedMessageData.authorName}</div>
        <div className="reply-message__text">{repliedMessageData.body}</div>
      </div>
      <div className="reply-message__close" onClick={closeReplyMessage}>
        <AppIcon name="cross" />
      </div>
    </div>
  )
}
