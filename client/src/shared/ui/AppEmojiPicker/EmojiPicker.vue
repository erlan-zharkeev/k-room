<script setup lang="ts">
import 'emoji-picker-element/picker'
import type Picker from 'emoji-picker-element/picker'
import type { EmojiClickEvent } from 'emoji-picker-element/shared'
import { useTemplateRef } from 'vue'

import type { EmojiPickerEmits, EmojiPickerProps } from './types'
import { useEmojiPickerElementShadowStyle } from './use-emoji-picker-element-shadow-style.model'

const props = defineProps<EmojiPickerProps>()
const emit = defineEmits<EmojiPickerEmits>()
const pickerElement = useTemplateRef<Picker>('pickerElement')

const handleEmojiClick = (event: EmojiClickEvent) => {
  emit('emojiClick', event)
}

useEmojiPickerElementShadowStyle(pickerElement)
</script>

<template>
  <component
    :is="'emoji-picker'"
    ref="pickerElement"
    :data-source="props.dataSource"
    :i18n.prop="props.i18n"
    :locale="props.language"
    @emoji-click="handleEmojiClick"
  />
</template>
