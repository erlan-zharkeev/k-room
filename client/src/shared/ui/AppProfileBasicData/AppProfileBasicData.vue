<script setup lang="ts">
import { liveQuery } from 'dexie'
import { Avatar } from 'primevue'
import { computed, ref, watch } from 'vue'

import { db } from 'src/shared/lib'

import { AppHeader } from '../AppHeader'
import { AppText } from '../AppText'

import { APP_PROFILE_BASIC_DATA_DEFAULT_PROPS } from './constants'
import type { IAppProfileBasicDataProps } from './types'

const props = withDefaults(defineProps<IAppProfileBasicDataProps>(), APP_PROFILE_BASIC_DATA_DEFAULT_PROPS)

const liveImageUrl = ref('')
const imageSrc = computed(() => liveImageUrl.value || props.fallbackImageSrc)

const clearLiveImageUrl = () => {
  if (liveImageUrl.value) {
    URL.revokeObjectURL(liveImageUrl.value)
    liveImageUrl.value = ''
  }
}

watch(
  () => props.imageId,
  (imageId, _previous, onCleanup) => {
    clearLiveImageUrl()

    if (!imageId) return

    const subscription = liveQuery(() => db.media.get(imageId)).subscribe({
      next: (record) => {
        clearLiveImageUrl()

        if (record?.blob) {
          liveImageUrl.value = URL.createObjectURL(record.blob)
        }
      },
      error: clearLiveImageUrl
    })

    onCleanup(() => {
      subscription.unsubscribe()
      clearLiveImageUrl()
    })
  },
  { immediate: true }
)
</script>

<template>
  <div class="app-profile-basic-data">
    <Avatar size="normal" shape="circle" :image="imageSrc" :alt="props.imageAlt ?? props.title" />
    <div class="app-profile-basic-data__text">
      <AppHeader class="app-profile-basic-data__title" tag="h4">{{ props.title }}</AppHeader>
      <slot name="description">
        <AppText class="app-profile-basic-data__label" size="large" />
      </slot>
    </div>
  </div>
</template>

<style scoped>
.app-profile-basic-data {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.app-profile-basic-data__avatar {
  display: block;
  flex: 0 0 auto;

  width: 34px;
  height: 34px;
  padding: 5px;
  border-radius: 12px;

  object-fit: cover;
  background: var(--p-app-widget-background, var(--p-content-background));
}

.app-profile-basic-data__text {
  display: grid;
  min-width: 0;
}

.app-profile-basic-data__title,
.app-profile-basic-data__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
