import { MESSAGE_BODY_MAX_LENGTH } from 'global-shared'
import { computed, type Ref, ref, useTemplateRef } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useNmorphEmojiPicker } from 'src/shared/lib'

import { useEmojiPickerQuickList } from './use-emoji-picker-quick-list.model'

export const useChatRoomMessageEmojiPicker = (messageText: Ref<string>) => {
  const { settings } = useSettings()
  const { emojiPickerQuickList, saveEmojiPickerQuickReaction } = useEmojiPickerQuickList()
  const messageEmojiDropdownAnchor = useTemplateRef<HTMLElement>('messageEmojiDropdownAnchor')
  const isMessageEmojiDropdownOpen = ref(false)
  const emojiPickerLanguage = computed(() => settings.value.localization.language)
  const { emojiPickerDataSource, emojiPickerI18n } = useNmorphEmojiPicker(emojiPickerLanguage)

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
    emojiPickerDataSource,
    emojiPickerI18n,
    emojiPickerLanguage,
    emojiPickerQuickList,
    isMessageEmojiDropdownOpen,
    closeMessageEmojiDropdown,
    selectMessageEmoji,
    toggleMessageEmojiDropdown
  }
}
