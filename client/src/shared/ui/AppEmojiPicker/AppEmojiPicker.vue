<script setup lang="ts">
import ruI18n from 'emoji-picker-element/i18n/ru_RU'
import zhI18n from 'emoji-picker-element/i18n/zh_CN'
import Picker from 'emoji-picker-element/picker'
import type { EmojiClickEvent } from 'emoji-picker-element/shared'
import { APP_LANGUAGE, type AppLanguageType } from 'global-shared'
import { Button } from 'primevue'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{
  expandLabel: string
  language: AppLanguageType
}>()
const emit = defineEmits<{
  select: [value: string]
}>()

const pickerRoot = ref<HTMLElement | null>(null)
const isExpanded = ref(false)
let pickerElement: Picker | undefined

const quickEmojiList = ['😀', '😂', '😍', '👍', '🙏', '🔥', '🎉', '❤️']

const dataSourceMap = {
  [APP_LANGUAGE.En]: '/emoji/en.json',
  [APP_LANGUAGE.Ru]: '/emoji/ru.json',
  [APP_LANGUAGE.Zh]: '/emoji/zh.json'
}

const i18nMap = {
  [APP_LANGUAGE.Ru]: ruI18n,
  [APP_LANGUAGE.Zh]: zhI18n
}

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
    dataSource: dataSourceMap[props.language],
    locale: props.language
  }

  pickerElement = new Picker(
    props.language === APP_LANGUAGE.En
      ? options
      : {
          ...options,
          i18n: i18nMap[props.language]
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
</script>

<template>
  <div class="app-emoji-picker" :class="{ 'app-emoji-picker--expanded': isExpanded }">
    <div class="app-emoji-picker__quick-row">
      <Button
        v-for="emoji in quickEmojiList"
        severity="secondary"
        @click="emit('select', emoji)"
        :key="emoji"
        class="app-emoji-picker__quick-button"
        >{{ emoji }}</Button
      >
      <Button
        v-if="!isExpanded"
        @click="expandPicker"
        severity="secondary"
        icon="pi pi-arrow-up-right-and-arrow-down-left-from-center"
        size="small"
      />
    </div>
    <div v-if="isExpanded" ref="pickerRoot" class="app-emoji-picker__full" />
  </div>
</template>

<style>
.app-emoji-picker {
  overflow: hidden;
  display: grid;

  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  background: var(--p-content-background);
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

  color: var(--p-text-color);

  background: transparent;
}

.app-emoji-picker__quick-button {
  font-size: 1.2rem;
  line-height: 1;
}

.app-emoji-picker__quick-button:hover,
.app-emoji-picker__expand-button:hover {
  background: var(--p-app-muted-background);
}

.app-emoji-picker__full {
  border-top: 1px solid var(--p-content-border-color);
}

.app-emoji-picker :deep(.app-emoji-picker__element) {
  --background: var(--p-content-background);
  --border-color: var(--p-content-border-color);
  --border-radius: 8px;
  --button-active-background: var(--p-content-border-color);
  --button-hover-background: var(--p-app-muted-background);
  --category-font-color: var(--p-text-color);
  --emoji-padding: 0.38rem;
  --emoji-size: 1.35rem;
  --indicator-color: var(--p-primary-color);
  --input-border-color: var(--p-content-border-color);
  --input-border-radius: 8px;
  --input-font-color: var(--p-text-color);
  --input-placeholder-color: var(--p-text-hover-muted-color);
  --outline-color: var(--p-primary-color);

  width: 100%;
  height: 360px;
}
</style>
