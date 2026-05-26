import { computed, toRef } from 'vue'

import type { MessageReactionGroup, MessageReactionTagItem, MessageReactionsProps } from '../config/types'

import { useMessageReaction } from './use-message-reaction.model'

export const useMessageReactions = (props: MessageReactionsProps) => {
  const message = toRef(props, 'message')
  const room = toRef(props, 'room')
  const { toggleMessageReaction } = useMessageReaction(message, room)

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
  // Todo Удалить height и common и цвета через пропсы прокинуть.
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
  // Todo заменить на v-model после выхода новой версии
  const selectMessageReaction = (event: MouseEvent) => {
    const target = event.target
    const currentTarget = event.currentTarget

    if (!(target instanceof Element)) return
    if (!(currentTarget instanceof Element)) return

    const reactionElement = target.closest('.nmorph-tag-item')
    if (!reactionElement) return

    // NmorphTagList не отдает value клика, поэтому связываем тег с реакцией по позиции.
    const reactionElementList = [...currentTarget.querySelectorAll('.nmorph-tag-item')]
    const reactionIndex = reactionElementList.indexOf(reactionElement)
    const reaction = reactionTagList.value[reactionIndex]
    if (!reaction) return

    toggleMessageReaction(reaction.value)
  }

  return {
    reactionList,
    reactionTagList,
    reactionTagListKey,
    selectMessageReaction
  }
}
