import moment from 'moment'
import { MessageBodyProps } from './@types/MessageBodyProps'
import { setContextMenu } from 'src/store/systemSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import constants from 'src/constants'
import { useEffect, useState } from 'react'
import { Tooltip } from 'antd'
import { Image } from 'antd'
import { Author } from 'common-types'

const MessageBody = ({ message, isChatMultiple }: MessageBodyProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const showMessageAuthor =
    !message.isSelf && isChatMultiple && message.authorName !== Author.system && message.authorName !== Author.time
  const [reactions, setReactions] = useState([] as Array<{ glyph: string; authors: Array<string> }>)
  const getGlyph = (name: string) => constants.emojis.find((emoji) => name === emoji.key)?.glyph

  const getAuthorTooltip = (authors: any) => {
    return authors.map((author: any) => author.username).join(', ')
  }

  const showCreatedAt = message.createdAt && message.authorId !== Author.system

  useEffect(() => {
    let reactionMap = {} as any
    message.reactions?.forEach((reaction) => {
      const authors = reactionMap[reaction.glyphKey] ? reactionMap[reaction.glyphKey].authors : []
      const hasAuthor = Boolean(authors.find((author: { id: string }) => author.id === reaction.authorId))
      if (hasAuthor) return
      authors.push({
        id: reaction.authorId,
        username: reaction.username
      })
      reactionMap[reaction.glyphKey] = {
        glyph: getGlyph(reaction.glyphKey),
        authors
      }
    })
    setReactions(Object.values(reactionMap))
  }, [message])

  const onContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (message.authorId === Author.system || message.authorId === Author.time) return
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
                  <div className="message__replied-message-image">
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
          <div className="paragraph-text paragraph-text--secondary paragraph-text--sm">
            {moment(Number(message.createdAt)).format('HH:mm')}
          </div>
        )}
      </div>
    </div>
  )
}
export default MessageBody
