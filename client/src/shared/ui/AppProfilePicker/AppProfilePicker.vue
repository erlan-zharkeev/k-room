<script setup lang="ts">
import { NmorphCheckbox, NmorphCheckboxGroup, NmorphScroll } from '@nmorph/nmorph-ui-kit'

import { AppProfileBasicData } from '../AppProfileBasicData'
import { AppText } from '../AppText'

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
      :model-value="selectedProfileIds"
      direction="column"
      design="checkbox"
      @update:model-value="selectProfiles"
    >
      <NmorphCheckbox
        v-for="item in profileItems"
        :id="item.id"
        :key="item.id"
        :disabled="item.isLocked"
        design="checkbox"
      >
        <AppProfileBasicData
          class="app-profile-picker__item"
          :image-id="item.imageId"
          :title="item.title"
          :name="item.title"
          :show-online="item.online"
        >
          <template #title>
            <AppText truncate :selectable="false" :text="item.title" />
          </template>
          <template #description>
            <AppText
              v-if="item.description"
              tag="small"
              truncate
              color="semi-contrast-text"
              :selectable="false"
              :text="item.description"
            />
          </template>
        </AppProfileBasicData>
      </NmorphCheckbox>
    </NmorphCheckboxGroup>
  </NmorphScroll>
</template>

<style lang="scss">
.app-profile-picker__item {
  width: 230px;
}
</style>
