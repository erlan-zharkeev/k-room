import type { EmojiClickEvent } from 'emoji-picker-element/shared'
import { APP_LANGUAGE } from 'global-shared'
import { computed, ref } from 'vue'

import { APP_EMOJI_PICKER_DATA_SOURCE_MAP, APP_EMOJI_PICKER_QUICK_EMOJI_LIST } from './constants'
import { APP_EMOJI_PICKER_I18N_MAP } from './i18n'
import type { AppEmojiPickerEmit, AppEmojiPickerProps } from './types'

export const useAppEmojiPicker = (props: AppEmojiPickerProps, emit: AppEmojiPickerEmit) => {
  const isExpanded = ref(false)
  const pickerDataSource = computed(() => APP_EMOJI_PICKER_DATA_SOURCE_MAP[props.language])
  const pickerI18n = computed(() =>
    props.language === APP_LANGUAGE.En ? undefined : APP_EMOJI_PICKER_I18N_MAP[props.language]
  )

  const handleEmojiClick = ({ detail }: EmojiClickEvent) => {
    const value = detail.unicode ?? ('unicode' in detail.emoji ? detail.emoji.unicode : '')

    if (value) {
      emit('select', value)
    }
  }

  const expandPicker = () => {
    isExpanded.value = true
  }

  return {
    expandPicker,
    handleEmojiClick,
    isExpanded,
    pickerDataSource,
    pickerI18n,
    quickEmojiList: APP_EMOJI_PICKER_QUICK_EMOJI_LIST
  }
}
