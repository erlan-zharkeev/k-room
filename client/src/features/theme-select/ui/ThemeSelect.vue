<script setup lang="ts">
import { NmorphIcon, NmorphSelectButton, NmorphSelectButtonItem } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { useI18n, useScreen } from 'src/shared/lib'
import { AppHeader } from 'src/shared/ui'

import { THEME_SELECT_DEFAULT_PROPS, THEME_SELECT_OPTIONS } from '../config/constants'
import { THEME_SELECT_I18N } from '../config/i18n'
import { useThemeSelect } from '../model/use-theme-select.model'

import type { ThemeSelectProps } from './types'

const props = withDefaults(defineProps<ThemeSelectProps>(), THEME_SELECT_DEFAULT_PROPS)

const { t } = useI18n()
const { settings, changeTheme } = useThemeSelect()
const { isPortraitTabletOrLess } = useScreen()
const themeIconWidth = computed(() => (props.compact || !isPortraitTabletOrLess.value ? '16px' : '24px'))
</script>

<template>
  <div :class="['theme-select', { 'theme-select--compact': props.compact }]">
    <NmorphSelectButton
      :aria-label="t(THEME_SELECT_I18N.selectTheme)"
      :height="props.compact ? 'basic' : 'thick'"
      :model-value="settings.appearance.selectedTheme"
      fill
      @update:model-value="changeTheme"
    >
      <template v-for="option in THEME_SELECT_OPTIONS" :key="option.value">
        <NmorphSelectButtonItem v-if="!props.compact || option.value !== 'custom'" :value="option.value">
          <div class="theme-select__option">
            <NmorphIcon :width="themeIconWidth" aria-hidden="true">
              <component :is="option.icon" />
            </NmorphIcon>
            <AppHeader
              v-if="!props.compact && !isPortraitTabletOrLess"
              tag="h5"
              :selectable="false"
              :text="t(option.label)"
            />
          </div>
        </NmorphSelectButtonItem>
      </template>
    </NmorphSelectButton>
  </div>
</template>

<style lang="scss">
.theme-select__option {
  @include flex-column-center;
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
