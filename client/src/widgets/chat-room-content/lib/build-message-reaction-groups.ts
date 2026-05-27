import type { MessageReaction } from 'global-shared'

import type { BuildMessageReactionGroupsParams, MessageReactionGroup } from '../config/types'

export const buildMessageReactionGroups = ({
  currentUserId,
  getUserAvatarId,
  reactions = [],
  visibleUserLimit
}: BuildMessageReactionGroupsParams): MessageReactionGroup[] => {
  const reactionMap = new Map<string, MessageReactionGroup>()

  reactions.forEach((reaction: MessageReaction) => {
    const current = reactionMap.get(reaction.glyphKey)
    const isSelected = reaction.authorId === currentUserId
    const reactionUser = {
      authorId: reaction.authorId,
      avatarId: getUserAvatarId(reaction.authorId),
      nickname: reaction.nickname
    }

    if (current) {
      current.users.push(reactionUser)
      current.count = current.users.length
      current.isSelected ||= isSelected

      if (current.visibleUsers.length < visibleUserLimit) {
        current.visibleUsers.push(reactionUser)
      }

      return
    }

    reactionMap.set(reaction.glyphKey, {
      glyphKey: reaction.glyphKey,
      users: [reactionUser],
      visibleUsers: [reactionUser],
      count: 1,
      isSelected
    })
  })

  return [...reactionMap.values()]
}
