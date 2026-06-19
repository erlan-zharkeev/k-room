import type { NmorphEmojiLocale } from '@nmorph/nmorph-ui-kit/emoji'
import { computed, shallowRef, watch } from 'vue'

import { useSettings } from 'src/entities/setting'

export const useNmorphEmojiPicker = () => {
  const { settings } = useSettings()
  const emojiPickerLocale = shallowRef<NmorphEmojiLocale>()
  const emojiPickerLanguage = computed(() => settings.value.localization.language)

  const loadEmojiPickerLocale = async () => {
    const language = emojiPickerLanguage.value
    const { loadNmorphEmojiLocale } = await import('@nmorph/nmorph-ui-kit/emoji')
    const locale = await loadNmorphEmojiLocale(language)

    if (language === emojiPickerLanguage.value) {
      emojiPickerLocale.value = locale
    }
  }

  watch(
    emojiPickerLanguage,
    () => {
      if (emojiPickerLocale.value) {
        void loadEmojiPickerLocale()
      }
    },
    { immediate: false }
  )

  return {
    emojiPickerLocale,
    loadEmojiPickerLocale
  }
}
