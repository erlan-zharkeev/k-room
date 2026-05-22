import './message-reactions.scss'
import { useEffect, useState } from 'react'

import { Tooltip } from 'antd'

import { EMOJI_LIST } from 'src/shared/config'
import { MessageBodyReaction, MessageReactionsProps } from './message-reactions.types.ts'

export const MessageReactions = ({ message }: MessageReactionsProps) => {
  const [reactions, setReactions] = useState<MessageBodyReaction[]>([])

  const getReactionAuthorTooltip = (authors: MessageBodyReaction['authors']) =>
    authors.map((author) => author.username).join(', ')

  const getReactionGlyphByName = (name: string) => EMOJI_LIST.find((emoji) => name === emoji.key)?.glyph

  useEffect(() => {
    const reactionMap: Record<string, MessageBodyReaction> = {}

    message.reactions?.forEach((reaction) => {
      const authors = reactionMap[reaction.glyphKey] ? reactionMap[reaction.glyphKey].authors : []
      const hasAuthor = Boolean(authors.find((author: { id: string }) => author.id === reaction.authorId))
      if (hasAuthor) return
      authors.push({
        id: reaction.authorId,
        username: reaction.username
      })
      const glyph = getReactionGlyphByName(reaction.glyphKey)
      if (!glyph) return
      reactionMap[reaction.glyphKey] = {
        glyph,
        authors
      }
    })
    setReactions(Object.values(reactionMap))
  }, [message])

  if (reactions.length <= 0) return null

  return (
    <div className="message-reactions">
      {reactions?.map((reaction) => (
        <div className="message-reactions__reaction" key={reaction.glyph}>
          <Tooltip
            title={getReactionAuthorTooltip(reaction.authors)}
            showArrow={false}
            destroyTooltipOnHide={true}
            placement="bottomRight"
          >
            <span>{reaction.glyph}</span>
          </Tooltip>
        </div>
      ))}
    </div>
  )
}
