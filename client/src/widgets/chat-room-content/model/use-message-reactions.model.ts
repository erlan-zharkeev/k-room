import { MESSAGE_REACTION_LIMIT_PER_USER } from 'global-shared'
import { computed, toRef } from 'vue'

import { useUser } from 'src/entities/user'

import type { MessageReactionsProps, MessageReactionTagItem } from '../config/types'
import { buildMessageReactionGroups } from '../lib/build-message-reaction-groups'
import { canToggleMessageReaction } from '../lib/can-toggle-message-reaction'

import { useChatRoomUserLookup } from './use-chat-room-user-lookup.model'
import { useMessageReaction } from './use-message-reaction.model'

export const useMessageReactions = (props: MessageReactionsProps) => {
  const message = toRef(props, 'message')
  const room = toRef(props, 'room')
  const { user } = useUser()
  const { getUserById } = useChatRoomUserLookup()
  const { toggleMessageReaction } = useMessageReaction(message, room)

  const selectMessageReaction = (glyphKey: string) => {
    const canToggle = canToggleMessageReaction({
      currentUserId: user.value.id,
      glyphKey,
      limit: MESSAGE_REACTION_LIMIT_PER_USER,
      reactions: message.value.reactions
    })

    if (!canToggle) return

    toggleMessageReaction(glyphKey)
  }

  const reactionList = computed<MessageReactionTagItem[]>(() =>
    buildMessageReactionGroups({
      currentUserId: user.value.id,
      getUserAvatarId: (authorId) => getUserById(authorId)?.avatarId,
      reactions: message.value.reactions,
      visibleUserLimit: 3
    }).map((reaction) => ({
      ...reaction,
      value: reaction.glyphKey,
      removable: false,
      height: 'thin',
      color: reaction.isSelected ? 'var(--app-accent-surface-soft)' : 'var(--app-muted-surface-soft)'
    }))
  )

  return {
    reactionList,
    selectMessageReaction
  }
}
