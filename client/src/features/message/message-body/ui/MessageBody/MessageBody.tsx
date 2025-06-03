import './style.scss'
import { useEffect, useState } from 'react'

import { Tooltip, Image } from 'antd'
import { IMessage, UserShortType } from 'common-types'

import { useContextMenu } from 'src/entities/context-menu'
import { EMOJI_LIST } from 'src/entities/emoji'

import { AppText } from 'src/shared/ui'
import { createClassNameWithModifiers } from 'src/shared/utils'

import { MessageTime } from '../MessageTime/MessageTime'

export interface MessageBodyProps {
  message: IMessage
  isPrivate: Boolean
}

interface IReaction {
  authors: UserShortType[]
  glyph: string
}

export const MessageBody = ({ message, isPrivate }: MessageBodyProps) => {
  const { setMenu } = useContextMenu()

  const isAutoMessage = message.authorName === 'system' || message.authorName === 'time'
  const showAuthorName = !isPrivate && !message.isSelf && !isAutoMessage

  const [reactions, setReactions] = useState<IReaction[]>([])

  const getGlyph = (name: string) => EMOJI_LIST.find((emoji) => name === emoji.key)?.glyph

  const getAuthorTooltip = (authors: IReaction['authors']) => {
    return authors.map((author) => author.username).join(', ')
  }

  useEffect(() => {
    const reactionMap: Record<string, IReaction> = {}

    message.reactions?.forEach((reaction) => {
      const authors = reactionMap[reaction.glyphKey] ? reactionMap[reaction.glyphKey].authors : []
      const hasAuthor = Boolean(authors.find((author: { id: string }) => author.id === reaction.authorId))
      if (hasAuthor) return
      authors.push({
        id: reaction.authorId,
        username: reaction.username
      })
      const glyph = getGlyph(reaction.glyphKey)
      if (!glyph) return
      reactionMap[reaction.glyphKey] = {
        glyph,
        authors
      }
    })
    setReactions(Object.values(reactionMap))
  }, [message])

  const onContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (message.authorId === 'system' || message.authorId === 'time') return
    setMenu(event, 'message', { message })
  }

  const haveRepliedMessage = Boolean(message.repliedMessage?.id)

  const className = createClassNameWithModifiers({ rootClass: 'message-body', modifiers: [message.status] })
  // const statusClassName = createClassNameWithModifiers({ rootClass: 'message-body__status', modifiers: [message.status] })

  return (
    <div className={className} message-id={message.id}>
      {showAuthorName && (
        <AppText accent additionalClassName="message-body__author">
          {message.authorName}
        </AppText>
      )}

      {haveRepliedMessage && (
        <div className="message-body__replied-message">
          <div className="message-body__replied-message-type">
            {message.repliedMessage?.forward ? 'Forwarded' : 'Replied'}
          </div>
          <div className="message-body__replied-message-wrapper">
            <div className="message-body__replied-message-images">
              {message.repliedMessage?.images &&
                message.repliedMessage.images.map((image) => (
                  <div key={image.src} className="message-body__replied-message-image">
                    <Image src={image.src} />
                  </div>
                ))}
            </div>
            <p>{message.repliedMessage?.authorName}</p>
            <p>{message.repliedMessage?.body}</p>
          </div>
        </div>
      )}

      {message.images && message.images.length > 0 && (
        <div className="message-body__images">
          {message.images.map((image) => (
            <div key={image.name} className="message-body__image">
              <Image src={image.src} />
            </div>
          ))}
        </div>
      )}

      <AppText>{message.body}</AppText>

      <div className="message-body__additional-info">
        {message.isSelf && isPrivate && <div className="message-body__status" />}

        {reactions && (
          <div className="message-body__reactions">
            {reactions?.map((reaction) => (
              <div className="message-body__reaction" key={reaction.glyph}>
                <Tooltip
                  title={getAuthorTooltip(reaction.authors)}
                  showArrow={false}
                  destroyTooltipOnHide={true}
                  placement="bottomRight"
                >
                  <span>{reaction.glyph}</span>
                </Tooltip>
              </div>
            ))}
          </div>
        )}

        <MessageTime createdAt={message.createdAt} />
      </div>
    </div>
  )
}
