<script setup lang="ts">
import { NmorphIcon, NmorphSelectButton, NmorphSelectButtonItem } from '@nmorph/nmorph-ui-kit'

import { useI18n } from 'src/shared/lib'
import { AppHeader } from 'src/shared/ui'

import { THEME_SELECT_DEFAULT_PROPS, THEME_SELECT_OPTIONS } from '../config/constants'
import { THEME_SELECT_I18N } from '../config/i18n'
import { useThemeSelect } from '../model/use-theme-select'

import type { IThemeSelectProps } from './types'

const props = withDefaults(defineProps<IThemeSelectProps>(), THEME_SELECT_DEFAULT_PROPS)

const { t } = useI18n()
const { settings, changeTheme } = useThemeSelect()
</script>

<template>
  <div :class="['theme-select', { 'theme-select--compact': props.compact }]">
    <NmorphSelectButton
      :aria-label="t(THEME_SELECT_I18N.selectTheme)"
      :class="['theme-select__input', { 'theme-select__input--compact': props.compact }]"
      :height="props.compact ? 'default' : 'thick'"
      :model-value="settings.appearance.selectedTheme"
      @update:model-value="changeTheme"
    >
      <template v-for="option in THEME_SELECT_OPTIONS" :key="option.value">
        <NmorphSelectButtonItem
          v-if="!props.compact || option.value !== 'custom'"
          :class="['theme-select__item', { 'theme-select__item--compact': props.compact }]"
          :value="option.value"
        >
          <div class="theme-select__option">
            <NmorphIcon class="theme-select__icon" size="small" aria-hidden="true">
              <component :is="option.icon" />
            </NmorphIcon>
            <AppHeader v-if="!props.compact" tag="h5" :text="t(option.label)" />
          </div>
        </NmorphSelectButtonItem>
      </template>
    </NmorphSelectButton>
  </div>
</template>

<style lang="scss">
.theme-select__option {
  @include flex-column-center;

  width: 100px;
}

.theme-select--compact {
  .theme-select__option {
    width: auto;
  }
}

.theme-select {
  .nmorph-select-button--thick {
    --thick-component: 60px;
  }
}
</style>
