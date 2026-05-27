import type { CanToggleMessageReactionParams } from '../config/types'

export const canToggleMessageReaction = ({
  currentUserId,
  glyphKey,
  limit,
  reactions = []
}: CanToggleMessageReactionParams) => {
  const isOwnReaction = reactions.some(
    (reaction) => reaction.authorId === currentUserId && reaction.glyphKey === glyphKey
  )
  if (isOwnReaction) return true
  const currentUserReactionCount = reactions.filter((reaction) => reaction.authorId === currentUserId).length
  return currentUserReactionCount < limit
}
