<script setup lang="ts">
import { NmorphAvatar, NmorphBadge } from '@nmorph/nmorph-ui-kit'

import { AppHeader } from '../AppHeader'
import { AppMediaImage } from '../AppMediaImage'

import { APP_PROFILE_BASIC_DATA_DEFAULT_PROPS } from './constants'
import type { AppProfileBasicDataProps } from './types'

const props = withDefaults(defineProps<AppProfileBasicDataProps>(), APP_PROFILE_BASIC_DATA_DEFAULT_PROPS)
</script>

<template>
  <div class="app-profile-basic-data">
    <AppMediaImage :media-id="props.imageId" :src="props.imageSrc">
      <template #default="{ src }">
        <NmorphBadge
          v-if="props.showOnline"
          is-dot
          color="var(--nmorph-success-color)"
          :dot-size="8"
          :offset-x="-1"
          :offset-y="-1"
        >
          <NmorphAvatar :src="src" :alt="props.imageAlt" shape="square" :name="props.name" preview />
        </NmorphBadge>
        <NmorphAvatar v-else :src="src" :alt="props.imageAlt" shape="square" :name="props.name" preview />
      </template>
    </AppMediaImage>
    <div class="app-profile-basic-data__content">
      <slot name="title">
        <AppHeader tag="h5" truncate :selectable="props.selectable" :text="props.title" />
      </slot>
      <div class="app-profile-basic-data__description">
        <slot name="description" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.app-profile-basic-data {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.app-profile-basic-data {
  .nmorph-avatar {
    flex: 0 0 auto;
  }
}

.app-profile-basic-data__content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: space-between;

  min-width: 0;
  margin-bottom: 1px;
}

.app-profile-basic-data__description {
  min-width: 0;
}
</style>
