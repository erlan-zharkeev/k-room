import emojis from 'src/components/ChatRoom/Components/EmojiDropdown/emojis'
import { ReactionsProps } from './@types'

export const Reactions = ({ reactionHandler }: ReactionsProps) => {
  const reactions = emojis.filter((emoji) => emoji.reactions)
  return (
    <div className="reactions">
      {reactions.map((reaction) => (
        <div className="reactions__element" key={reaction.key} onClick={() => reactionHandler(reaction.key)}>
          {reaction.glyph}
        </div>
      ))}
    </div>
  )
}
export default Reactions
