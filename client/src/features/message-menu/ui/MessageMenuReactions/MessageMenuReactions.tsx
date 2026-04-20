import './style.scss'

import { useMemo } from 'react'

import { IEventAddReaction, SocketActionsType } from 'common'

import { IReactionsProps } from 'src/features/message-menu'

import { EMOJI_LIST } from 'src/entities/emoji'

import { socket } from 'src/shared/api'
import { createClassNameWithModifiers } from 'src/shared/lib'

export const MessageReactions = ({ userId, username, selectedChatRoomId, message }: IReactionsProps) => {
  const reactions = EMOJI_LIST.filter((emoji) => emoji.reactions)

  const selfReactions = useMemo(
    () =>
      message.reactions?.filter((reaction) => reaction.authorId === userId).map((reaction) => reaction.glyphKey) ?? [],
    [message.reactions]
  )
  const isDisabled = (glyphKey: string) => (selfReactions.includes(glyphKey) ? 'disabled' : 'default')

  const addReactionToMessage = (key: string) => {
    const payload: IEventAddReaction = {
      glyphKey: key,
      messageId: message.id,
      roomId: selectedChatRoomId,
      username
    }
    socket.emit<SocketActionsType>('add-reaction', payload)
  }

  return (
    <div className="message-menu-reactions">
      {reactions.map((reaction) => (
        <button
          type="button"
          className={createClassNameWithModifiers({
            rootClass: 'message-menu-reactions__element',
            modifiers: [isDisabled(reaction.key)]
          })}
          key={reaction.key}
          onClick={() => addReactionToMessage(reaction.key)}
        >
          {reaction.glyph}
        </button>
      ))}
    </div>
  )
}
