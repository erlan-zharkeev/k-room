<script setup lang="ts">
import { NmorphAvatar } from '@nmorph/nmorph-ui-kit'
import { liveQuery } from 'dexie'
import { computed, ref, watch } from 'vue'

import { db } from 'src/shared/lib'

import { AppHeader } from '../AppHeader'

import { APP_PROFILE_BASIC_DATA_DEFAULT_PROPS } from './constants'
import type { IAppProfileBasicDataProps } from './types'

const props = withDefaults(defineProps<IAppProfileBasicDataProps>(), APP_PROFILE_BASIC_DATA_DEFAULT_PROPS)

const liveImageUrl = ref('')
const imageSrc = computed(() => props.imageSrc || liveImageUrl.value || undefined)

const clearLiveImageUrl = () => {
  if (liveImageUrl.value) {
    URL.revokeObjectURL(liveImageUrl.value)
    liveImageUrl.value = ''
  }
}

// TODO Отсмотреть потом
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
    <NmorphAvatar :src="imageSrc" :alt="props.imageAlt" shape="square" :name="props.name" />
    <div class="app-profile-basic-data__content">
      <div class="app-profile-basic-data__title">
        <slot name="title">
          <AppHeader tag="h5" truncate :text="props.title" />
        </slot>
      </div>
      <div class="app-profile-basic-data__description">
        <slot name="description" />
      </div>
    </div>
  </div>
</template>

<style>
.app-profile-basic-data {
  display: flex;
  gap: 10px;
  min-width: 0;
}

.app-profile-basic-data__content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  min-width: 0;
  margin-bottom: 1px;
}

.app-profile-basic-data__title {
  min-width: 0;
}

.app-profile-basic-data__description {
  display: flex;
  align-items: flex-start;
  min-width: 0;
}
</style>
