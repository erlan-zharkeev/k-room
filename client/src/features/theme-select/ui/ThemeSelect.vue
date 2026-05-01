<script setup lang="ts">
import { SelectButton } from 'primevue'
import { computed } from 'vue'

import { useI18n } from 'src/shared/lib'
import { AppHeader } from 'src/shared/ui'

import { THEME_SELECT_DEFAULT_PROPS, THEME_SELECT_OPTIONS } from '../config/constants'
import { THEME_SELECT_I18N } from '../config/i18n'
import { useThemeSelect } from '../model/use-theme-select'

import type { IThemeSelectProps } from './types'

const props = withDefaults(defineProps<IThemeSelectProps>(), THEME_SELECT_DEFAULT_PROPS)

const { t } = useI18n()
const { settings, changeTheme } = useThemeSelect()
const themeOptions = computed(() =>
  THEME_SELECT_OPTIONS.filter((option) => !props.compact || option.value !== 'custom').map((option) => ({
    ...option,
    label: t(option.label)
  }))
)

const selectButtonPt = computed(() => ({
  root: {
    class: ['theme-select__input', { 'theme-select__input--compact': props.compact }],
    'aria-label': t(THEME_SELECT_I18N.selectTheme)
  }
}))
</script>

<template>
  <div class="theme-select">
    <SelectButton
      :data-key="'value'"
      fluid
      :model-value="settings.theme"
      :option-label="'label'"
      :option-value="'value'"
      :options="themeOptions"
      :pt="selectButtonPt"
      :size="props.compact ? 'small' : 'large'"
      @update:model-value="changeTheme"
    >
      <template #option="{ option }">
        <div class="theme-select__option">
          <i :class="['theme-select__icon', option.icon]" aria-hidden="true" />
          <AppHeader v-if="!props.compact" tag="h5" :text="option.label" />
        </div>
      </template>
    </SelectButton>
  </div>
</template>
