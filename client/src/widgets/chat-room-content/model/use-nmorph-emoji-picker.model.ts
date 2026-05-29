import { loadNmorphEmojiLocale } from '@nmorph/nmorph-ui-kit/emoji'
import type { NmorphEmojiLocale } from '@nmorph/nmorph-ui-kit/emoji'
import { computed, shallowRef, watch } from 'vue'

import { useSettings } from 'src/entities/setting'

export const useNmorphEmojiPicker = () => {
  const { settings } = useSettings()
  const emojiPickerLocale = shallowRef<NmorphEmojiLocale>()
  const emojiPickerLanguage = computed(() => settings.value.localization.language)

  watch(
    emojiPickerLanguage,
    async (currentLanguage) => {
      emojiPickerLocale.value = await loadNmorphEmojiLocale(currentLanguage)
    },
    { immediate: true }
  )

  return {
    emojiPickerLocale
  }
}
