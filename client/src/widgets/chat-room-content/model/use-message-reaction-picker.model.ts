import { onMounted, toRef } from 'vue'

import type { MessageReactionPickerEmit, MessageReactionPickerProps } from '../config/types'

import { useEmojiPickerQuickList } from './use-emoji-picker-quick-list.model'
import { useMessageReaction } from './use-message-reaction.model'
import { useNmorphEmojiPicker } from './use-nmorph-emoji-picker.model'

export const useMessageReactionPicker = (props: MessageReactionPickerProps, emit: MessageReactionPickerEmit) => {
  const message = toRef(props, 'message')
  const room = toRef(props, 'room')
  const { emojiPickerQuickList, saveEmojiPickerQuickReaction } = useEmojiPickerQuickList()
  const { canUpdateMessageReaction, toggleMessageReaction } = useMessageReaction(message, room)
  const { emojiPickerLocale, loadEmojiPickerLocale } = useNmorphEmojiPicker()

  onMounted(() => {
    void loadEmojiPickerLocale()
  })

  const selectMessageReaction = (glyphKey: string) => {
    if (!canUpdateMessageReaction.value) return

    void saveEmojiPickerQuickReaction(glyphKey)
    toggleMessageReaction(glyphKey)
    emit('select')
  }

  return {
    emojiPickerLocale,
    emojiPickerQuickList,
    selectMessageReaction
  }
}
