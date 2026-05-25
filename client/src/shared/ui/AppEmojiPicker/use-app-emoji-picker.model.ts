import { useEventListener } from '@vueuse/core'
import Picker from 'emoji-picker-element/picker'
import type { EmojiClickEvent } from 'emoji-picker-element/shared'
import { APP_LANGUAGE } from 'global-shared'
import { nextTick, onBeforeUnmount, ref, shallowRef, useTemplateRef, watch } from 'vue'

import { APP_EMOJI_PICKER_DATA_SOURCE_MAP, APP_EMOJI_PICKER_QUICK_EMOJI_LIST } from './constants'
import { APP_EMOJI_PICKER_I18N_MAP } from './i18n'
import type { AppEmojiPickerEmit, AppEmojiPickerProps } from './types'

export const useAppEmojiPicker = (props: AppEmojiPickerProps, emit: AppEmojiPickerEmit) => {
  const pickerRootRef = useTemplateRef<HTMLElement>('pickerRoot')
  const isExpanded = ref(false)
  const pickerElement = shallowRef<Picker | null>(null)

  const handleEmojiClick = ({ detail }: EmojiClickEvent) => {
    const value = detail.unicode ?? ('unicode' in detail.emoji ? detail.emoji.unicode : '')

    if (value) {
      emit('select', value)
    }
  }

  const destroyPicker = () => {
    pickerElement.value?.remove()
    pickerElement.value = null
  }

  const mountPicker = () => {
    destroyPicker()

    if (!isExpanded.value) return

    const root = pickerRootRef.value

    if (!root) return

    const options = {
      dataSource: APP_EMOJI_PICKER_DATA_SOURCE_MAP[props.language],
      locale: props.language
    }

    const picker = new Picker(
      props.language === APP_LANGUAGE.En
        ? options
        : {
            ...options,
            i18n: APP_EMOJI_PICKER_I18N_MAP[props.language]
          }
    )

    picker.classList.add('app-emoji-picker__element')
    pickerElement.value = picker
    root.append(picker)
  }

  const expandPicker = async () => {
    isExpanded.value = true
    await nextTick()
    mountPicker()
  }

  onBeforeUnmount(destroyPicker)
  useEventListener<EmojiClickEvent>(pickerElement, 'emoji-click', handleEmojiClick)

  watch(() => props.language, mountPicker)

  return {
    expandPicker,
    isExpanded,
    quickEmojiList: APP_EMOJI_PICKER_QUICK_EMOJI_LIST
  }
}
