import { computed, toRef } from 'vue'

import type {
  MessageReactionGroup,
  MessageReactionTagItem,
  MessageReactionsProps
} from '../config/types'

export const useMessageReactions = (props: MessageReactionsProps) => {
  const message = toRef(props, 'message')

  const reactionList = computed<MessageReactionGroup[]>(() => {
    const reactionMap = new Map<string, MessageReactionGroup>()

    message.value.reactions?.forEach((reaction) => {
      const current = reactionMap.get(reaction.glyphKey)
      const user = {
        authorId: reaction.authorId,
        nickname: reaction.nickname
      }

      if (current) {
        current.users.push(user)
        current.count = current.users.length
        return
      }

      reactionMap.set(reaction.glyphKey, {
        glyphKey: reaction.glyphKey,
        users: [user],
        count: 1
      })
    })

    return [...reactionMap.values()]
  })

  const reactionTagList = computed<MessageReactionTagItem[]>(() =>
    reactionList.value.map((reaction) => ({
      value: reaction.glyphKey,
      text: reaction.count > 1 ? `${reaction.glyphKey} ${reaction.count}` : reaction.glyphKey,
      removable: false,
      height: 'thin',
      design: 'common'
    }))
  )

  const reactionTagListKey = computed(() =>
    reactionTagList.value.map((reaction) => `${reaction.value}:${reaction.text}`).join('|')
  )

  return {
    reactionList,
    reactionTagList,
    reactionTagListKey
  }
}
