import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { UIIcon } from 'src/components'
import { clientConstants } from 'src/client-constants'
import { useTypedSelector } from 'src/hooks'
import { AppDispatch, resetContextClickedObject, resetRepliedMessage } from 'src/store'

export const ReplyMessage = () => {
  const { repliedMessageData } = useTypedSelector((state) => state.chatRooms)

  const [height, setHeight] = useState(0)

  useEffect(() => {
    const { fullInputMessage, shortInputMessage } = clientConstants.dimensions
    const updatedHeight = repliedMessageData.id ? fullInputMessage - shortInputMessage - 8 : 0
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
        <UIIcon name="reply" color="accent" />
      </div>
      <div className="reply-message__content">
        <div className="reply-message__author">{repliedMessageData.authorName}</div>
        <div className="reply-message__text">{repliedMessageData.body}</div>
      </div>
      <div className="reply-message__close" onClick={closeReplyMessage}>
        <UIIcon name="cross" />
      </div>
    </div>
  )
}
