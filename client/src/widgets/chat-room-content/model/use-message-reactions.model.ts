import { computed, nextTick, ref, toRef } from 'vue'

import { useUser } from 'src/entities/user'

import { MESSAGE_REACTION_SELECTED_TAG_COLOR } from '../config/constants'
import type { MessageReactionGroup, MessageReactionTagItem, MessageReactionsProps } from '../config/types'

import { useMessageReaction } from './use-message-reaction.model'

export const useMessageReactions = (props: MessageReactionsProps) => {
  const message = toRef(props, 'message')
  const room = toRef(props, 'room')
  const { user } = useUser()
  const { toggleMessageReaction } = useMessageReaction(message, room)
  const lastSelectedReactionGlyphKey = ref<string | null>(null)
  const selectedReactionGlyphKey = computed<string | null>({
    get: () => null,
    set: (glyphKey) => {
      if (glyphKey === null) return
      if (lastSelectedReactionGlyphKey.value === glyphKey) return

      lastSelectedReactionGlyphKey.value = glyphKey
      void nextTick(() => {
        lastSelectedReactionGlyphKey.value = null
      })
      toggleMessageReaction(glyphKey)
    }
  })

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
      const selectedColor = reaction.isSelected ? MESSAGE_REACTION_SELECTED_TAG_COLOR : undefined

      return {
        value: reaction.glyphKey,
        text: reaction.count > 1 ? `${reaction.glyphKey} ${reaction.count}` : reaction.glyphKey,
        removable: false,
        height: 'thin',
        color: selectedColor
      }
    })
  )

  const reactionTagListKey = computed(() =>
    reactionTagList.value.map((reaction) => `${reaction.value}:${reaction.text}:${reaction.color || ''}`).join('|')
  )

  return {
    reactionList,
    reactionTagList,
    reactionTagListKey,
    selectedReactionGlyphKey
  }
}
