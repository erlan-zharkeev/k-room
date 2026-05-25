<script setup lang="ts">
import { NmorphAvatar, NmorphBadge } from '@nmorph/nmorph-ui-kit'

import { AppHeader } from '../AppHeader'

import { APP_PROFILE_BASIC_DATA_DEFAULT_PROPS } from './constants'
import type { AppProfileBasicDataProps } from './types'
import { useAppProfileBasicData } from './use-app-profile-basic-data.model'

const props = withDefaults(defineProps<AppProfileBasicDataProps>(), APP_PROFILE_BASIC_DATA_DEFAULT_PROPS)
const { imageSrc } = useAppProfileBasicData(props)
</script>

<template>
  <div class="app-profile-basic-data">
    <NmorphBadge
      type="dot"
      size="base"
      color="var(--nmorph-success-color)"
      :hidden="!props.showOnline"
      :offset-x="-1"
      :offset-y="-1"
    >
      <NmorphAvatar
        :src="imageSrc"
        :alt="props.imageAlt"
        :size="props.avatarSize"
        shape="square"
        :name="props.name"
        preview
      />
    </NmorphBadge>
    <div class="app-profile-basic-data__content">
      <slot name="title">
        <AppHeader tag="h5" truncate :selectable="props.selectable" :text="props.title" />
      </slot>
      <div v-if="$slots.description" class="app-profile-basic-data__description">
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
  justify-content: center;

  min-width: 0;
  margin-bottom: 1px;
}

.app-profile-basic-data__description {
  min-width: 0;
}

.app-profile-basic-data__description:empty {
  display: none;
}
</style>
