import './style.scss'

import { EMOJI_LIST } from 'src/entities/emoji'

export interface ReactionsProps {
  reactionHandler: (reaction: string) => void
  blockedKeys: string[]
}

export const Reactions = ({ reactionHandler, blockedKeys }: ReactionsProps) => {
  const reactions = EMOJI_LIST.filter((emoji) => emoji.reactions)
  const isDisabled = (glyphKey: string) => (blockedKeys.includes(glyphKey) ? 'disabled' : 'default')
  return (
    <div className="reactions">
      {reactions.map((reaction) => (
        <div
          className={`reactions__element reactions__element--${isDisabled(reaction.key)}`}
          key={reaction.key}
          onClick={() => reactionHandler(reaction.key)}
        >
          {reaction.glyph}
        </div>
      ))}
    </div>
  )
}
