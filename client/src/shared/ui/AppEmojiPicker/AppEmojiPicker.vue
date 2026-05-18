<script setup lang="ts">
import { NmorphButton, NmorphIconExpand } from '@nmorph/nmorph-ui-kit'

import type { IAppEmojiPickerEmits, IAppEmojiPickerProps } from './types'
import { useAppEmojiPicker } from './use-app-emoji-picker.model'

const props = defineProps<IAppEmojiPickerProps>()
const emit = defineEmits<IAppEmojiPickerEmits>()
const { expandPicker, isExpanded, quickEmojiList } = useAppEmojiPicker(props, emit)
</script>

<template>
  <div class="app-emoji-picker" :class="{ 'app-emoji-picker--expanded': isExpanded }">
    <div class="app-emoji-picker__quick-row">
      <NmorphButton
        v-for="emoji in quickEmojiList"
        :key="emoji"
        class="app-emoji-picker__quick-button"
        shape="square"
        style-type="transparent"
        :text="emoji"
        @click="emit('select', emoji)"
      />
      <NmorphButton
        v-if="!isExpanded"
        :aria-label="props.expandLabel"
        class="app-emoji-picker__expand-button"
        shape="square"
        style-type="transparent"
        @click="expandPicker"
      >
        <template #icon>
          <NmorphIconExpand />
        </template>
      </NmorphButton>
    </div>
    <div v-if="isExpanded" ref="pickerRoot" class="app-emoji-picker__full" />
  </div>
</template>

<style>
.app-emoji-picker {
  overflow: hidden;
  display: grid;

  border: 1px solid var(--app-content-border-color);
  border-radius: 8px;

  background: var(--app-content-background);
}

.app-emoji-picker__quick-row {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr)) 36px;
  gap: 4px;
  padding: 6px;
}

.app-emoji-picker--expanded .app-emoji-picker__quick-row {
  grid-template-columns: repeat(8, minmax(0, 1fr));
}

.app-emoji-picker__quick-button,
.app-emoji-picker__expand-button {
  cursor: pointer;

  display: grid;
  place-items: center;

  min-width: 0;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 6px;

  color: var(--nmorph-contrast-text-color);

  background: transparent;
}

.app-emoji-picker__quick-button {
  font-size: 1.2rem;
  line-height: 1;
}

.app-emoji-picker__quick-button:hover,
.app-emoji-picker__expand-button:hover {
  background: var(--app-muted-background);
}

.app-emoji-picker__full {
  border-top: 1px solid var(--app-content-border-color);
}

.app-emoji-picker :deep(.app-emoji-picker__element) {
  --background: var(--app-content-background);
  --border-color: var(--app-content-border-color);
  --border-radius: 8px;
  --button-active-background: var(--app-content-border-color);
  --button-hover-background: var(--app-muted-background);
  --category-font-color: var(--nmorph-contrast-text-color);
  --emoji-padding: 0.38rem;
  --emoji-size: 1.35rem;
  --indicator-color: var(--nmorph-accent-color);
  --input-border-color: var(--app-content-border-color);
  --input-border-radius: 8px;
  --input-font-color: var(--nmorph-contrast-text-color);
  --input-placeholder-color: var(--nmorph-placeholder-text-color);
  --outline-color: var(--nmorph-accent-color);

  width: 100%;
  height: 360px;
}
</style>
