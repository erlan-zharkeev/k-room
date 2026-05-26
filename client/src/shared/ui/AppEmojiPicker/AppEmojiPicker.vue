<script setup lang="ts">
import { NmorphIcon, NmorphIconExpand } from '@nmorph/nmorph-ui-kit'

import EmojiPicker from './EmojiPicker.vue'
import type { AppEmojiPickerEmits, AppEmojiPickerProps } from './types'
import { useAppEmojiPicker } from './use-app-emoji-picker.model'

const props = defineProps<AppEmojiPickerProps>()
const emit = defineEmits<AppEmojiPickerEmits>()
const { expandPicker, handleEmojiClick, isExpanded, pickerDataSource, pickerI18n, quickEmojiList } = useAppEmojiPicker(
  props,
  emit
)
</script>

<template>
  <div class="app-emoji-picker" :class="{ 'app-emoji-picker--expanded': isExpanded }">
    <div v-if="!isExpanded" class="app-emoji-picker__quick-row">
      <button
        v-for="emoji in quickEmojiList"
        :key="emoji"
        class="app-emoji-picker__quick-button"
        @click="emit('select', emoji)"
      >
        {{ emoji }}
      </button>
      <button
        v-if="!isExpanded"
        :aria-label="props.expandLabel"
        class="app-emoji-picker__expand-button"
        @click="expandPicker"
      >
        <NmorphIcon color="var(--nmorph-contrast-text-color)">
          <NmorphIconExpand />
        </NmorphIcon>
      </button>
    </div>
    <div v-if="isExpanded" class="app-emoji-picker__full">
      <EmojiPicker
        :key="props.language"
        class="app-emoji-picker__element"
        :data-source="pickerDataSource"
        :i18n="pickerI18n"
        :language="props.language"
        @emoji-click="handleEmojiClick"
      />
    </div>
  </div>
</template>

<style lang="scss">
.app-emoji-picker {
  button {
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
  }

  button:hover {
    background: var(--nmorph-placeholder-text-color);
  }
}

.app-emoji-picker__quick-row {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
}

.app-emoji-picker__expand-button {
  display: flex;
  justify-content: center;
}

.app-emoji-picker__element {
  --background: var(--nmorph-main-bg);
  --border-size: 0;
  --button-hover-background: var(--nmorph-placeholder-text-color);
  --category-emoji-padding: 0.42rem;
  --category-emoji-size: 1rem;
  --emoji-padding: 0.42rem;
  --emoji-size: 1rem;
  --input-border-color: var(--nmorph-placeholder-text-color);
  --input-font-size: 0.95rem;
  --input-font-color: var(--nmorph-contrast-text-color);
  --input-padding: 0.35rem 0.5rem;
  --input-placeholder-color: var(--nmorph-placeholder-text-color);
  --num-columns: 7;

  width: 100%;
  height: 260px;
}
</style>
