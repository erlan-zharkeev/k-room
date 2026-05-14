<script setup lang="ts">
import { NmorphAvatar } from '@nmorph/nmorph-ui-kit'

import { AppHeader } from '../AppHeader'

import { APP_PROFILE_BASIC_DATA_DEFAULT_PROPS } from './constants'
import type { IAppProfileBasicDataProps } from './types'
import { useAppProfileBasicData } from './use-app-profile-basic-data.model'

const props = withDefaults(defineProps<IAppProfileBasicDataProps>(), APP_PROFILE_BASIC_DATA_DEFAULT_PROPS)
const { imageSrc } = useAppProfileBasicData(props)
</script>

<template>
  <div class="app-profile-basic-data">
    <NmorphAvatar :src="imageSrc" :alt="props.imageAlt" :shape="props.avatarShape" :name="props.name" preview />
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

.app-profile-basic-data__title {
  min-width: 0;
}
</style>
