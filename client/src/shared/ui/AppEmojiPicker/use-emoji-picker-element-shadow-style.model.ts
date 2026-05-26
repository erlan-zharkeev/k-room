import type Picker from 'emoji-picker-element/picker'
import { watchEffect, type ShallowRef } from 'vue'

import { EMOJI_PICKER_ELEMENT_SHADOW_STYLE, EMOJI_PICKER_ELEMENT_SHADOW_STYLE_ID } from './constants'

export const useEmojiPickerElementShadowStyle = (pickerElement: Readonly<ShallowRef<Picker | null>>) => {
  const applyEmojiPickerElementShadowStyle = () => {
    const shadowRoot = pickerElement.value?.shadowRoot

    if (!shadowRoot || shadowRoot.getElementById(EMOJI_PICKER_ELEMENT_SHADOW_STYLE_ID)) return

    const styleElement = document.createElement('style')
    styleElement.id = EMOJI_PICKER_ELEMENT_SHADOW_STYLE_ID
    styleElement.textContent = EMOJI_PICKER_ELEMENT_SHADOW_STYLE
    shadowRoot.append(styleElement)
  }

  watchEffect(applyEmojiPickerElementShadowStyle)
}
