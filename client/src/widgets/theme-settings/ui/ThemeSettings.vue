<script setup lang="ts">
import { ThemeSelect } from 'src/features/theme-select'
import type { CustomThemeColorType } from 'src/shared/config'
import { getCustomThemeColor } from 'src/shared/lib'
import { AppHeader, AppText } from 'src/shared/ui'

import { THEME_SETTINGS_COLOR_ITEMS } from '../config/constants'
import { THEME_SETTINGS_I18N } from '../config/i18n'

import type { IThemeSettingsEmits, IThemeSettingsProps } from './types'

const props = defineProps<IThemeSettingsProps>()
const emit = defineEmits<IThemeSettingsEmits>()

const changeCustomThemeColor = (colorName: CustomThemeColorType, event: Event) => {
  emit('changeCustomThemeColor', colorName, (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="theme-settings">
    <ThemeSelect />

    <div v-if="props.theme === 'custom'" class="theme-settings__custom">
      <AppHeader tag="h2" :text="$t(THEME_SETTINGS_I18N.customThemeSettings)" />
      <label v-for="item in THEME_SETTINGS_COLOR_ITEMS" :key="item.id" class="theme-settings__field">
        <AppText :text="$t(item.label)" />
        <input
          :value="getCustomThemeColor(props.customTheme, item.id)"
          type="color"
          @input="changeCustomThemeColor(item.id, $event)"
        />
      </label>
    </div>
  </div>
</template>

<style>
.theme-settings,
.theme-settings__custom {
  display: grid;
  gap: 12px;
  align-content: start;
}

.theme-settings__field {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 44px;
  gap: 12px;
  align-items: center;

  min-height: 44px;
}

.theme-settings__field input {
  cursor: pointer;

  width: 44px;
  height: 34px;
  padding: 0;
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  background: transparent;
}
</style>
