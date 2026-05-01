<script setup lang="ts">
import { ColorPicker } from 'primevue'

import { useSettings } from 'src/entities/setting'
import { ThemeSelect } from 'src/features/theme-select'
import { AppText } from 'src/shared/ui'

import { THEME_SETTINGS_COLOR_ITEMS } from '../config/constants'
import { useChangeColorSchema } from '../model/use-change-color-schema'

const { effectiveTheme, isSelectedThemeSystem } = useSettings()
const { changeThemeColor } = useChangeColorSchema()
</script>

<template>
  <div class="theme-settings">
    <ThemeSelect />
    <div class="theme-settings__pick-color" v-if="!isSelectedThemeSystem">
      <label v-for="item in THEME_SETTINGS_COLOR_ITEMS" :key="item.id" class="theme-settings__field">
        <AppText :text="$t(item.label)" />
        <ColorPicker
          :model-value="effectiveTheme.colorSchema[item.id]"
          @update:model-value="($event) => changeThemeColor(item.id, $event)"
        />
      </label>
    </div>
  </div>
</template>

<style>
.theme-settings {
  display: grid;
  gap: 12px;
}

.theme-settings__field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
</style>
