import { computed, toRef } from 'vue'

import { useUser } from 'src/entities/user'

import type { MessageReactionGroup, MessageReactionTagItem, MessageReactionsProps } from '../config/types'

import { useMessageReaction } from './use-message-reaction.model'

export const useMessageReactions = (props: MessageReactionsProps) => {
  const message = toRef(props, 'message')
  const room = toRef(props, 'room')
  const { user } = useUser()
  const { toggleMessageReaction } = useMessageReaction(message, room)

  const selectMessageReaction = (glyphKey: string) => {
    toggleMessageReaction(glyphKey)
  }

  const reactionList = computed<MessageReactionGroup[]>(() => {
    const reactionMap = new Map<string, MessageReactionGroup>()

    message.value.reactions?.forEach((reaction) => {
      const current = reactionMap.get(reaction.glyphKey)
      const isSelected = reaction.authorId === user.value.id
      const reactionUser = {
        authorId: reaction.authorId,
        nickname: reaction.nickname
      }

      if (current) {
        current.users.push(reactionUser)
        current.count = current.users.length
        current.isSelected ||= isSelected
        return
      }

      reactionMap.set(reaction.glyphKey, {
        glyphKey: reaction.glyphKey,
        users: [reactionUser],
        count: 1,
        isSelected
      })
    })

    return [...reactionMap.values()]
  })

  const reactionTagList = computed<MessageReactionTagItem[]>(() =>
    reactionList.value.map((reaction) => {
      const backgroundColor = reaction.isSelected ? 'var(--app-accent-surface-soft)' : 'var(--app-muted-surface-soft)'

      return {
        value: reaction.glyphKey,
        text: reaction.count > 1 ? `${reaction.glyphKey} ${reaction.count}` : reaction.glyphKey,
        removable: false,
        height: 'thin',
        style: {
          '--tag-item-background-color': backgroundColor,
          '--tag-item-content-color': 'var(--nmorph-contrast-text-color)'
        }
      }
    })
  )

  const reactionTagListKey = computed(() =>
    reactionTagList.value
      .map((reaction) => `${reaction.value}:${reaction.text}:${reaction.style['--tag-item-background-color']}`)
      .join('|')
  )

  return {
    reactionList,
    reactionTagList,
    reactionTagListKey,
    selectMessageReaction
  }
}
