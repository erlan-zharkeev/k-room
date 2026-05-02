<script setup lang="ts">
import { ColorPicker } from 'primevue'

import { useSettings } from 'src/entities/setting'
import { ThemeSelect } from 'src/features/theme-select'
import { AppText } from 'src/shared/ui'

import { THEME_SETTINGS_COLOR_ITEMS } from '../config/constants'
import { useChangeColorSchema } from '../model/use-change-color-schema'

const { effectiveTheme, isSelectedThemeCustom } = useSettings()
const { changeThemeColor } = useChangeColorSchema()
</script>

<template>
  <div class="theme-settings-form">
    <ThemeSelect />
    <div class="theme-settings-form__pick-color" v-if="isSelectedThemeCustom">
      <label v-for="item in THEME_SETTINGS_COLOR_ITEMS" :key="item.id" class="theme-settings-form__field">
        <AppText :text="$t(item.label)" />
        <ColorPicker
          format="hex"
          :model-value="effectiveTheme.colorSchema[item.id]"
          @update:model-value="($event) => changeThemeColor(item.id, `#${$event}`)"
        />
      </label>
    </div>
  </div>
</template>

<style>
.theme-settings-form {
  display: grid;
  gap: 12px;
}

.theme-settings-form__field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
</style>
