import './style.scss'
import { SocketActionsType, IEventAddReaction, IEventDeleteMessage } from 'common-types'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import {
  repliedMessageSetAsForward,
  updateMessageStatus,
  setRepliedMessage,
  useChatRooms
} from 'src/entities/chat-room'
import { useContextMenu } from 'src/entities/context-menu/hooks'
import { showModal } from 'src/entities/system'

import { socket } from 'src/shared/api'
import { useTypedSelector } from 'src/shared/lib'
import { AppIcon } from 'src/shared/ui'

import { Reactions } from './elements'

export const MessageContextMenu = () => {
  const dispatch = useDispatch<AppDispatch>()

  const { contextClickedObject } = useContextMenu()
  const { message } = contextClickedObject

  const { id, username } = useTypedSelector((state) => state.user.userData)

  const { selectedChatRoom } = useChatRooms()

  const selfReactions =
    message.reactions?.filter((reaction) => reaction.authorId === id).map((reaction) => reaction.glyphKey) ?? []

  const reactionHandler = (key: string) => {
    const payload: IEventAddReaction = {
      glyphKey: key,
      messageId: message.id,
      roomId: selectedChatRoom?.id ?? '',
      username
    }
    socket.emit<SocketActionsType>('add-reaction', payload)
  }

  const forwardHandler = () => {
    dispatch(repliedMessageSetAsForward())
    dispatch(showModal({ title: 'Forward message', modalContentComponentName: 'forward-message-popup' }))
  }

  const deleteHandler = () => {
    if (!selectedChatRoom?.id) return
    const roomId = selectedChatRoom.id
    const messageId = message.id
    const payload: IEventDeleteMessage = {
      roomId,
      messageId
    }

    dispatch(updateMessageStatus({ roomId, messageId, status: 'sending' }))
    socket.emit<SocketActionsType>('delete-message', payload)
  }

  return (
    <div className="message-context-menu">
      <div className="message-context-menu__element">
        <Reactions reactionHandler={reactionHandler} blockedKeys={selfReactions} />
      </div>
      <div
        className="message-context-menu__element context-menu__element"
        onClick={() => dispatch(setRepliedMessage(contextClickedObject.message))}
      >
        <AppIcon name="reply" />
        <span>Reply</span>
      </div>
      <div className="message-context-menu__element context-menu__element forward-icon" onClick={forwardHandler}>
        <AppIcon name="reply" />
        <span>Forward</span>
      </div>
      {contextClickedObject.message.isSelf && (
        <div className="message-context-menu__element context-menu__element delete-icon" onClick={deleteHandler}>
          <AppIcon name="trash" />
          <span>Delete</span>
        </div>
      )}
    </div>
  )
}
