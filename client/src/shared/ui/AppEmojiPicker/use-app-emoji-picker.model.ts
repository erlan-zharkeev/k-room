import Picker from 'emoji-picker-element/picker'
import type { EmojiClickEvent } from 'emoji-picker-element/shared'
import { APP_LANGUAGE } from 'global-shared'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

import {
  APP_EMOJI_PICKER_DATA_SOURCE_MAP,
  APP_EMOJI_PICKER_I18N_MAP,
  APP_EMOJI_PICKER_QUICK_EMOJI_LIST
} from './constants'
import type { AppEmojiPickerEmitType, IAppEmojiPickerProps } from './types'

export const useAppEmojiPicker = (props: IAppEmojiPickerProps, emit: AppEmojiPickerEmitType) => {
  const pickerRoot = ref<HTMLElement | null>(null)
  const isExpanded = ref(false)
  let pickerElement: Picker | undefined

  const handleEmojiClick = ({ detail }: EmojiClickEvent) => {
    const value = detail.unicode ?? ('unicode' in detail.emoji ? detail.emoji.unicode : '')

    if (value) {
      emit('select', value)
    }
  }

  const destroyPicker = () => {
    pickerElement?.removeEventListener('emoji-click', handleEmojiClick)
    pickerElement?.remove()
    pickerElement = undefined
  }

  const mountPicker = () => {
    destroyPicker()

    if (!isExpanded.value) return

    const root = pickerRoot.value

    if (!root) return

    const options = {
      dataSource: APP_EMOJI_PICKER_DATA_SOURCE_MAP[props.language],
      locale: props.language
    }

    pickerElement = new Picker(
      props.language === APP_LANGUAGE.En
        ? options
        : {
            ...options,
            i18n: APP_EMOJI_PICKER_I18N_MAP[props.language]
          }
    )

    pickerElement.classList.add('app-emoji-picker__element')
    pickerElement.addEventListener('emoji-click', handleEmojiClick)
    root.append(pickerElement)
  }

  const expandPicker = async () => {
    isExpanded.value = true
    await nextTick()
    mountPicker()
  }

  onBeforeUnmount(destroyPicker)

  watch(() => props.language, mountPicker)

  return {
    expandPicker,
    isExpanded,
    pickerRoot,
    quickEmojiList: APP_EMOJI_PICKER_QUICK_EMOJI_LIST
  }
}
