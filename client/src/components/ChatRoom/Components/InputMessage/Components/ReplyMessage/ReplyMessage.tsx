import { useDispatch } from 'react-redux'
import UIIcon from 'src/components/UI/UIIcon'
import useTypedSelector from 'src/hooks/useTypedSelector'
import { AppDispatch } from 'src/store'
import { resetRepliedMessage } from 'src/store/roomsSlice'
import { resetContextClickedObject } from 'src/store/systemSlice'
import constants from 'src/constants'
import { useEffect, useState } from 'react'

export const ReplyMessage = () => {
  const { repliedMessageData } = useTypedSelector((state) => state.chatRooms)

  const [height, setHeight] = useState(0)

  useEffect(() => {
    const updatedHeight = repliedMessageData.id ? (constants.fullInputMessage - constants.shortInputMessage - 8) : 0
    setHeight(updatedHeight)
  }, [repliedMessageData])

  const dispatch = useDispatch<AppDispatch>()
  const closeReplyMessage = () => {
    dispatch(resetContextClickedObject())
    dispatch(resetRepliedMessage())
  }
  return (
    <div className="reply-message" style={{
      height: `${height}px`,
      display: height ? 'flex' : 'none'
    }}>
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

export default ReplyMessage
