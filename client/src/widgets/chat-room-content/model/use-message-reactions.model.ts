import { MESSAGE_REACTION_LIMIT_PER_USER } from 'global-shared'
import { computed, ref, toRef, useTemplateRef, watch } from 'vue'

import { useUser } from 'src/entities/user'

import { MESSAGE_REACTION_VISIBLE_GROUP_LIMIT, MESSAGE_REACTION_VISIBLE_USER_LIMIT } from '../config/constants'
import type { MessageReactionsProps, MessageReactionDetailsItem, MessageReactionTagItem } from '../config/types'
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
  const reactionsDropdownAnchor = useTemplateRef<HTMLElement>('reactionsDropdownAnchor')
  const isReactionDropdownOpen = ref(false)

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
      visibleUserLimit: MESSAGE_REACTION_VISIBLE_USER_LIMIT
    }).map((reaction) => ({
      ...reaction,
      value: reaction.glyphKey,
      removable: false,
      height: 'thin',
      color: reaction.isSelected ? 'var(--app-accent-surface-soft)' : 'var(--app-muted-surface-soft)'
    }))
  )
  const hiddenReactionGroupsCount = computed(() =>
    Math.max(reactionList.value.length - MESSAGE_REACTION_VISIBLE_GROUP_LIMIT, 0)
  )
  const hasHiddenReactionGroups = computed(() => hiddenReactionGroupsCount.value > 0)
  const reactionDetailsList = computed<MessageReactionDetailsItem[]>(() =>
    reactionList.value.flatMap((reaction) =>
      reaction.users.map((reactionUser) => ({
        id: `${reaction.glyphKey}-${reactionUser.authorId}`,
        glyphKey: reaction.glyphKey,
        user: reactionUser
      }))
    )
  )

  const toggleReactionDropdown = () => {
    isReactionDropdownOpen.value = !isReactionDropdownOpen.value
  }

  const closeReactionDropdown = () => {
    isReactionDropdownOpen.value = false
  }

  watch(hasHiddenReactionGroups, (hasHiddenReactionGroups) => {
    if (hasHiddenReactionGroups) return

    closeReactionDropdown()
  })

  return {
    closeReactionDropdown,
    hasHiddenReactionGroups,
    isReactionDropdownOpen,
    reactionDetailsList,
    reactionList,
    reactionsDropdownAnchor,
    hiddenReactionGroupsCount,
    selectMessageReaction,
    toggleReactionDropdown
  }
}
