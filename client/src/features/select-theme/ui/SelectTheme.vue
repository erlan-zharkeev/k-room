<script setup lang="ts">
import { NmorphText, NmorphIcon, NmorphSelectButton, NmorphSelectButtonItem } from '@nmorph/nmorph-ui-kit'

import { useI18n } from 'src/shared/lib'

import { SELECT_THEME_DEFAULT_PROPS, SELECT_THEME_OPTIONS } from '../config/constants'
import { SELECT_THEME_I18N } from '../config/i18n'

import type { SelectThemeProps } from './types'
import { useSelectThemeView } from './use-select-theme-view.model'

const props = withDefaults(defineProps<SelectThemeProps>(), SELECT_THEME_DEFAULT_PROPS)

const { t } = useI18n()
const { settings, changeTheme, isPortraitTabletOrLess, themeIconWidth } = useSelectThemeView(props)
</script>

<template>
  <div :class="['select-theme', { 'select-theme--compact': props.compact }]">
    <NmorphSelectButton
      class="select-theme__control"
      :aria-label="t(SELECT_THEME_I18N.selectTheme)"
      :custom-thickness="props.compact ? '30px' : '60px'"
      :model-value="settings.appearance.selectedTheme"
      fill
      @update:model-value="changeTheme"
    >
      <template v-for="option in SELECT_THEME_OPTIONS" :key="option.value">
        <NmorphSelectButtonItem v-if="!props.compact || option.value !== 'custom'" :value="option.value">
          <div class="select-theme__option">
            <NmorphIcon :width="themeIconWidth" aria-hidden="true">
              <component :is="option.icon" />
            </NmorphIcon>
            <NmorphText v-if="!props.compact && !isPortraitTabletOrLess" as="h5" variant="title-small" weight="bold">{{
              t(option.label)
            }}</NmorphText>
          </div>
        </NmorphSelectButtonItem>
      </template>
    </NmorphSelectButton>
  </div>
</template>

<style lang="scss" scoped>
.select-theme__option {
  @include flex-column-center;
}

.select-theme--compact {
  .select-theme__option {
    width: auto;
  }
}
</style>
