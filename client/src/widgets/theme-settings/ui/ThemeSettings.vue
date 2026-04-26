<script setup lang="ts">
import type { CustomThemeColorType, ICustomThemeSetting, ThemeType } from 'src/shared/config'
import { getCustomThemeColor, isThemeType } from 'src/shared/lib'
import { AppHeader, AppText } from 'src/shared/ui'

import { THEME_SETTINGS_COLOR_ITEMS, THEME_SETTINGS_OPTIONS } from '../config/constants'
import { THEME_SETTINGS_I18N } from '../config/i18n'

defineProps<{
  theme: ThemeType
  customTheme: ICustomThemeSetting
}>()

const emit = defineEmits<{
  changeTheme: [theme: ThemeType]
  changeCustomThemeColor: [colorName: CustomThemeColorType, value: string]
}>()

const changeTheme = (theme: unknown) => {
  if (!isThemeType(theme)) return

  emit('changeTheme', theme)
}

const changeCustomThemeColor = (colorName: CustomThemeColorType, event: Event) => {
  emit('changeCustomThemeColor', colorName, (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="theme-settings">
    <div class="theme-settings__options">
      <button
        v-for="option in THEME_SETTINGS_OPTIONS"
        :key="option.value"
        class="theme-settings__option"
        :class="{ 'theme-settings__option--active': theme === option.value }"
        type="button"
        @click="changeTheme(option.value)"
      >
        <AppText>{{ $t(option.label) }}</AppText>
      </button>
    </div>

    <div v-if="theme === 'custom'" class="theme-settings__custom">
      <AppHeader tag="h2">{{ $t(THEME_SETTINGS_I18N.customThemeSettings) }}</AppHeader>
      <label v-for="item in THEME_SETTINGS_COLOR_ITEMS" :key="item.id" class="theme-settings__field">
        <AppText>{{ $t(item.label) }}</AppText>
        <input
          :value="getCustomThemeColor(customTheme, item.id)"
          type="color"
          @input="changeCustomThemeColor(item.id, $event)"
        />
      </label>
    </div>
  </div>
</template>

<style scoped>
.theme-settings,
.theme-settings__custom {
  display: grid;
  gap: 12px;
  align-content: start;
}

.theme-settings__options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
}

.theme-settings__option {
  cursor: pointer;

  min-height: 72px;
  padding: 14px;
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;

  text-align: left;

  background: var(--p-app-muted-background);
}

.theme-settings__option:hover,
.theme-settings__option--active {
  border-color: var(--p-primary-color);
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
