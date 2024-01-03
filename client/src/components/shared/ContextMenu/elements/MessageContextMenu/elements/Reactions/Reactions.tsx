import { clientConstants } from 'src/client-constants'

export interface ReactionsProps {
  reactionHandler: (reaction: string) => void
  blockedKeys: Array<string>
}

export const Reactions = ({ reactionHandler, blockedKeys }: ReactionsProps) => {
  const reactions = clientConstants.emojis.filter((emoji) => emoji.reactions)
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
