import './style.scss'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/app/store'
import { useEffect, useState } from 'react'
import { Tooltip, Image } from 'antd'
import { Message, UserShort } from 'common-types'
import { clientConstants } from 'src/client-constants'
import { setContextMenu } from 'src/entities/system'

export interface MessageBodyProps {
  message: Message
  isChatMultiple: Boolean
}

interface Reaction {
  authors: Array<UserShort>
  glyph: string
}

export const MessageBody = ({ message, isChatMultiple }: MessageBodyProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const notSystemAuthor = message.authorName !== 'system' && message.authorName !== 'time'
  const showMessageAuthor = !message.isSelf && isChatMultiple && notSystemAuthor
  const [reactions, setReactions] = useState<Reaction[]>([])

  const getGlyph = (name: string) => clientConstants.emojis.find((emoji) => name === emoji.key)?.glyph

  const getAuthorTooltip = (authors: Reaction['authors']) => {
    return authors.map((author) => author.username).join(', ')
  }

  const showCreatedAt = message.createdAt && message.authorId !== 'system'

  useEffect(() => {
    const reactionMap: Record<string, Reaction> = {}

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

  const onContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (message.authorId === 'system' || message.authorId === 'time') return
    dispatch(setContextMenu({ event: e, type: 'message', contextClickedObject: { message } }))
  }

  const haveRepliedMessage = Boolean(message.repliedMessage?.id)

  return (
    <div className={`message message--${message.status}`} message-id={message.id} onContextMenu={onContextMenu}>
      {showMessageAuthor && (
        <div className="message__author paragraph-text paragraph-text--sm">{message.authorName}</div>
      )}

      {haveRepliedMessage && (
        <div className="message__replied-message">
          <div className="message__replied-message-type">
            {message.repliedMessage?.forward ? 'Forwarded' : 'Replied'}
          </div>
          <div className="message__replied-message-wrapper">
            <div className="message__replied-message-images">
              {message.repliedMessage?.images &&
                message.repliedMessage.images.map((image) => (
                  <div key={image.src} className="message__replied-message-image">
                    <Image src={image.src} />
                  </div>
                ))}
            </div>
            <p>{message.repliedMessage?.authorName}</p>
            <p>{message.repliedMessage?.body}</p>
          </div>
        </div>
      )}

      <div className="message__images">
        {message.images &&
          message.images.map((image) => (
            <div key={image.name} className="message__image">
              <Image src={image.src} />
            </div>
          ))}
      </div>

      <div className="message__text">{message.body}</div>
      <div className="message__system-info">
        {message.isSelf && !isChatMultiple && <div className="message__status" />}
        <div className="message__reactions">
          {reactions &&
            reactions?.map((reaction) => (
              <div className="message__reaction" key={reaction.glyph}>
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
        {showCreatedAt && (
          <div className="paragraph-text  paragraph-text--sm">{moment(Number(message.createdAt)).format('HH:mm')}</div>
        )}
      </div>
    </div>
  )
}
