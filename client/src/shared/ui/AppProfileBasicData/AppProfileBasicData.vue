<script setup lang="ts">
import { NmorphText, NmorphAvatar, NmorphBadge, NmorphIcon } from '@nmorph/nmorph-ui-kit'

import { APP_PROFILE_BASIC_DATA_DEFAULT_PROPS } from './constants'
import type { AppProfileBasicDataProps } from './types'
import { useAppProfileBasicData } from './use-app-profile-basic-data.model'

const props = withDefaults(defineProps<AppProfileBasicDataProps>(), APP_PROFILE_BASIC_DATA_DEFAULT_PROPS)
const { avatarIconStyle, imageSrc } = useAppProfileBasicData(props)
</script>

<template>
  <div class="app-profile-basic-data">
    <NmorphBadge
      type="dot"
      size="extra-large"
      color="var(--nmorph-success-text-color)"
      :hidden="!props.showOnline"
      :offset-x="-1"
      :offset-y="-1"
    >
      <div v-if="props.avatarIcon" class="app-profile-basic-data__avatar-icon" :style="avatarIconStyle">
        <NmorphIcon :width="props.avatarIconSize" :height="props.avatarIconSize" :color="props.avatarIconColor">
          <component :is="props.avatarIcon" />
        </NmorphIcon>
      </div>
      <NmorphAvatar
        v-else
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
        <NmorphText as="h5" truncate variant="title-small" weight="bold">{{ props.title }}</NmorphText>
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

.app-profile-basic-data__avatar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
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
