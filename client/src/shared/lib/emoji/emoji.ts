import type { INmorphEmojiPickerI18n, NmorphEmojiPickerDataSource } from '@nmorph/nmorph-ui-kit'
import type { AppLanguage } from 'global-shared'
import { computed, ref, watch, type Ref } from 'vue'

import {
  EMOJI_PICKER_CATEGORY_LABELS,
  EMOJI_PICKER_DATA_SOURCE_URL_BY_LANGUAGE,
  EMOJI_PICKER_QUICK_LIST_LIMIT
} from './constants'

export const useNmorphEmojiPicker = (language: Ref<AppLanguage>) => {
  const dataSource = ref<NmorphEmojiPickerDataSource>([])
  const i18n = computed<INmorphEmojiPickerI18n>(() => ({
    categoryLabels: EMOJI_PICKER_CATEGORY_LABELS
  }))

  watch(
    language,
    async (currentLanguage) => {
      const response = await fetch(EMOJI_PICKER_DATA_SOURCE_URL_BY_LANGUAGE[currentLanguage])
      dataSource.value = (await response.json()) as NmorphEmojiPickerDataSource
    },
    { immediate: true }
  )

  return {
    emojiPickerDataSource: dataSource,
    emojiPickerI18n: i18n
  }
}

export const buildNextEmojiPickerQuickList = (quickList: string[], emoji: string) => {
  const nextQuickList = [emoji, ...quickList.filter((item) => item !== emoji)]

  return nextQuickList.slice(0, EMOJI_PICKER_QUICK_LIST_LIMIT)
}
