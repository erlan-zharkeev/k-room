<script setup lang="ts">
import { NmorphText, NmorphCheckbox, NmorphCheckboxGroup, NmorphScroll } from '@nmorph/nmorph-ui-kit'

import { AppProfileBasicData } from '../AppProfileBasicData'

import { APP_PROFILE_PICKER_PROPS_DEFAULTS } from './constants'
import type { AppProfilePickerProps } from './types'
import { useAppProfilePicker } from './use-app-profile-picker.model'

const selectedProfileIds = defineModel<string[]>({ required: true })
const props = withDefaults(defineProps<AppProfilePickerProps>(), APP_PROFILE_PICKER_PROPS_DEFAULTS)
const { profileItems, selectProfiles } = useAppProfilePicker(props, selectedProfileIds)
</script>

<template>
  <NmorphScroll scroll-x-prop="hidden" :height="props.height" :max-height="props.maxHeight" class="app-profile-picker">
    <NmorphCheckboxGroup
      class="app-profile-picker__group"
      :model-value="selectedProfileIds"
      direction="column"
      design="plain"
      thickness="thin"
      @update:model-value="selectProfiles"
    >
      <NmorphCheckbox
        v-for="item in profileItems"
        :id="item.id"
        :key="item.id"
        class="app-profile-picker__checkbox"
        :disabled="item.isLocked"
        design="plain"
      >
        <AppProfileBasicData
          class="app-profile-picker__item"
          :avatar-size="44"
          :avatar-icon="item.avatarIcon"
          :avatar-icon-color="item.avatarIconColor"
          :avatar-icon-size="item.avatarIconSize"
          :image-id="item.imageId"
          :title="item.title"
          :name="item.title"
          :show-online="item.online"
        >
          <template #title>
            <NmorphText truncate>{{ item.title }}</NmorphText>
          </template>
          <template #description>
            <NmorphText v-if="item.description" as="small" truncate color="semi-contrast" variant="body-small">{{
              item.description
            }}</NmorphText>
          </template>
        </AppProfileBasicData>
      </NmorphCheckbox>
    </NmorphCheckboxGroup>
  </NmorphScroll>
</template>

<style lang="scss" scoped>
.app-profile-picker {
  width: 100%;
  min-width: 0;
}

.app-profile-picker__group {
  display: block;
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
}

.app-profile-picker__group :deep(.nmorph-checkbox-group__wrapper),
.app-profile-picker__group :deep(.nmorph-checkbox-group__content),
.app-profile-picker__checkbox,
.app-profile-picker__checkbox :deep(.nmorph-checkbox__content) {
  width: 100%;
}

.app-profile-picker__checkbox :deep(.nmorph-checkbox__content) {
  justify-content: flex-start;
}

.app-profile-picker__checkbox :deep(.nmorph-checkbox__label) {
  flex: 1 1 auto;
  min-width: 0;
  margin-left: var(--indentation-03);
}

.app-profile-picker__item {
  width: 100%;
  min-width: 0;
}
</style>
