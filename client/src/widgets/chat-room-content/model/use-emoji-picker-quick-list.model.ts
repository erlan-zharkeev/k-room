import { computed } from 'vue'

import { useSettings } from 'src/entities/setting'
import { buildNextEmojiPickerQuickList } from 'src/shared/lib'

export const useEmojiPickerQuickList = () => {
  const { settings, shallowUpdate } = useSettings()
  const emojiPickerQuickList = computed(() => settings.value.quickReactions)

  const saveEmojiPickerQuickReaction = (emoji: string) => {
    const quickReactions = buildNextEmojiPickerQuickList(settings.value.quickReactions, emoji)

    return shallowUpdate({ quickReactions })
  }

  return {
    emojiPickerQuickList,
    saveEmojiPickerQuickReaction
  }
}
