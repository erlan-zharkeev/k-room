<script setup lang="ts">
import { NmorphCheckbox, NmorphCheckboxGroup, NmorphScroll } from '@nmorph/nmorph-ui-kit'

import { AppProfileBasicData } from '../AppProfileBasicData'
import { AppText } from '../AppText'

import { APP_USER_PICKER_PROPS_DEFAULTS } from './constants'
import type { AppUserPickerProps } from './types'
import { useAppUserPicker } from './use-app-user-picker.model'

const selectedUserIds = defineModel<string[]>({ required: true })
const props = withDefaults(defineProps<AppUserPickerProps>(), APP_USER_PICKER_PROPS_DEFAULTS)
const { selectUsers, userItems } = useAppUserPicker(props, selectedUserIds)
</script>

<template>
  <NmorphScroll scroll-x-prop="hidden" :height="props.height" :max-height="props.maxHeight" class="app-user-picker">
    <NmorphCheckboxGroup
      :model-value="selectedUserIds"
      direction="column"
      design="checkbox"
      @update:model-value="selectUsers"
    >
      <NmorphCheckbox
        v-for="item in userItems"
        :id="item.id"
        :key="item.id"
        :disabled="item.isLocked"
        design="checkbox"
      >
        <AppProfileBasicData
          class="app-user-picker__item"
          :image-id="item.imageId"
          :title="item.nickname"
          :name="item.nickname"
          :show-online="item.online"
        >
          <template #title>
            <AppText truncate :selectable="false" :text="item.nickname" />
          </template>
        </AppProfileBasicData>
      </NmorphCheckbox>
    </NmorphCheckboxGroup>
  </NmorphScroll>
</template>

<style lang="scss">
.app-user-picker__item {
  width: 230px;
}
</style>
