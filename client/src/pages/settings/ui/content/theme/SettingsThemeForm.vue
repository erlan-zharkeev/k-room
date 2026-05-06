<script setup lang="ts">
import {
  NmorphButton,
  NmorphColorPicker,
  NmorphDivider,
  NmorphIcon,
  NmorphSelectButton,
  NmorphSelectButtonItem,
  NmorphSlider
} from '@nmorph/nmorph-ui-kit'

import { useSettings } from 'src/entities/setting'
import { AppText } from 'src/shared/ui'

import {
  THEME_SETTINGS_COLOR_GROUPS,
  THEME_SETTINGS_RESET_THEME_OPTIONS,
  THEME_SETTINGS_SHADOW_ITEMS
} from '../../../config/constants'
import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../../config/i18n/appearance'
import { useChangeColorSchema } from '../../../model/theme/use-change-color-schema'
import { useResetCustomTheme } from '../../../model/theme/use-reset-custom-theme'

const { effectiveTheme } = useSettings()
const { changeThemeColor, changeThemeShadowSetting } = useChangeColorSchema()
const { resetTheme, changeResetTheme, resetCustomTheme } = useResetCustomTheme()
</script>

<template>
  <div class="settings-theme-form">
    <div class="settings-theme-form__reset">
      <NmorphSelectButton
        class="settings-theme-form__reset-source"
        :aria-label="$t(SETTINGS_PAGE_APPEARANCE_I18N.resetThemeSource)"
        :model-value="resetTheme"
        @update:model-value="changeResetTheme"
      >
        <NmorphSelectButtonItem
          v-for="option in THEME_SETTINGS_RESET_THEME_OPTIONS"
          :key="option.value"
          :aria-label="$t(option.label)"
          :value="option.value"
        >
          <NmorphIcon size="small" aria-hidden="true">
            <component :is="option.icon" />
          </NmorphIcon>
        </NmorphSelectButtonItem>
      </NmorphSelectButton>

      <NmorphButton
        class="settings-theme-form__reset-button"
        :text="$t(SETTINGS_PAGE_APPEARANCE_I18N.resetTheme)"
        @click="resetCustomTheme"
      />
    </div>

    <NmorphDivider class="settings-theme-form__divider" />

    <div class="settings-theme-form__pick-color">
      <template v-for="(group, index) in THEME_SETTINGS_COLOR_GROUPS" :key="group.id">
        <NmorphDivider v-if="index > 0" class="settings-theme-form__divider" />

        <div class="settings-theme-form__group">
          <label v-for="item in group.items" :key="item.id" class="settings-theme-form__field">
            <AppText :text="$t(item.label)" />
            <NmorphColorPicker
              :model-value="effectiveTheme.colorSchema[item.id]"
              show-value
              @update:model-value="($event) => changeThemeColor(item.id, $event)"
            />
          </label>
        </div>
      </template>

      <NmorphDivider class="settings-theme-form__divider" />

      <div class="settings-theme-form__group">
        <label v-for="item in THEME_SETTINGS_SHADOW_ITEMS" :key="item.id" class="settings-theme-form__slider">
          <div class="settings-theme-form__slider-label">
            <AppText tag="small" :text="`${$t(item.label)} ${effectiveTheme[item.id]}${item.unit}`" />
          </div>
          <NmorphSlider
            :model-value="effectiveTheme[item.id]"
            :min="item.min"
            :max="item.max"
            :step="item.step"
            :show-tooltip="false"
            @update:model-value="($event) => changeThemeShadowSetting(item.id, $event)"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<style>
.settings-theme-form {
  display: grid;
  gap: 12px;
}

.settings-theme-form__reset {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.settings-theme-form__divider {
  margin: 12px 0;
}

.settings-theme-form__field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.settings-theme-form__slider {
  display: block;
  margin-bottom: 12px;
}

.settings-theme-form__slider-label {
  display: block;
  margin-bottom: 12px;
  text-align: right;
}
</style>
