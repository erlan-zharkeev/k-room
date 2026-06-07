import { MESSAGE_BODY_MAX_LENGTH } from 'global-shared'
import { type Ref, ref, useTemplateRef } from 'vue'

import type { ChatRoomMessageEmojiPickerModel } from '../config/types'

import { useEmojiPickerQuickList } from './use-emoji-picker-quick-list.model'
import { useNmorphEmojiPicker } from './use-nmorph-emoji-picker.model'

export const useChatRoomMessageEmojiPicker = (messageText: Ref<string>): ChatRoomMessageEmojiPickerModel => {
  const { emojiPickerQuickList, saveEmojiPickerQuickReaction } = useEmojiPickerQuickList()
  const messageEmojiDropdownAnchor = useTemplateRef<HTMLElement>('messageEmojiDropdownAnchor')
  const isMessageEmojiDropdownOpen = ref(false)
  const { emojiPickerLocale } = useNmorphEmojiPicker()

  const toggleMessageEmojiDropdown = () => {
    isMessageEmojiDropdownOpen.value = !isMessageEmojiDropdownOpen.value
  }

  const closeMessageEmojiDropdown = () => {
    isMessageEmojiDropdownOpen.value = false
  }

  const selectMessageEmoji = (emoji: string) => {
    const nextMessageText = `${messageText.value}${emoji}`
    const hasValidLength = nextMessageText.length <= MESSAGE_BODY_MAX_LENGTH

    if (!hasValidLength) return

    messageText.value = nextMessageText
    void saveEmojiPickerQuickReaction(emoji)
  }

  return {
    messageEmojiDropdownAnchor,
    emojiPickerLocale,
    emojiPickerQuickList,
    isMessageEmojiDropdownOpen,
    closeMessageEmojiDropdown,
    selectMessageEmoji,
    toggleMessageEmojiDropdown
  }
}
