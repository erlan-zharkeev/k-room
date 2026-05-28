import { computed, toRef } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useNmorphEmojiPicker } from 'src/shared/lib'

import type { MessageReactionPickerEmit, MessageReactionPickerProps } from '../config/types'

import { useEmojiPickerQuickList } from './use-emoji-picker-quick-list.model'
import { useMessageReaction } from './use-message-reaction.model'

export const useMessageReactionPicker = (props: MessageReactionPickerProps, emit: MessageReactionPickerEmit) => {
  const message = toRef(props, 'message')
  const room = toRef(props, 'room')
  const { settings } = useSettings()
  const { emojiPickerQuickList, saveEmojiPickerQuickReaction } = useEmojiPickerQuickList()
  const { canUpdateMessageReaction, toggleMessageReaction } = useMessageReaction(message, room)
  const emojiPickerLanguage = computed(() => settings.value.localization.language)
  const { emojiPickerDataSource, emojiPickerI18n } = useNmorphEmojiPicker(emojiPickerLanguage)

  const selectMessageReaction = (glyphKey: string) => {
    if (!canUpdateMessageReaction.value) return

    void saveEmojiPickerQuickReaction(glyphKey)
    toggleMessageReaction(glyphKey)
    emit('select')
  }

  return {
    emojiPickerDataSource,
    emojiPickerI18n,
    emojiPickerLanguage,
    emojiPickerQuickList,
    selectMessageReaction
  }
}
