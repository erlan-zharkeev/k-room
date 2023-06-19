import { ReactionsProps } from './@types'
import constants from 'src/constants'

const Reactions = ({ reactionHandler, blockedKeys }: ReactionsProps) => {
  const reactions = constants.emojis.filter((emoji) => emoji.reactions)
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
export default Reactions
