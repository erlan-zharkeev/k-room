<script setup lang="ts">
import {
  NmorphText,
  NmorphButton,
  NmorphColorPicker,
  NmorphDivider,
  NmorphIcon,
  NmorphSelectButton,
  NmorphSelectButtonItem,
  NmorphSlider
} from '@nmorph/nmorph-ui-kit'

import { useSettings } from 'src/entities/setting'

import {
  CUSTOM_THEME_COLOR_GROUPS,
  CUSTOM_THEME_RESET_OPTIONS,
  CUSTOM_THEME_SHADOW_ITEMS
} from '../../../config/constants/custom-theme.constants'
import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../../config/i18n/appearance.i18n'
import { useCustomThemeReset } from '../../../model/appearance/use-custom-theme-reset.model'
import { useCustomThemeSchema } from '../../../model/appearance/use-custom-theme-schema.model'
import SettingsCard from '../../SettingsCard.vue'

const { effectiveTheme, isSelectedThemeCustom } = useSettings()
const { changeThemeColor, changeThemeShadowSetting } = useCustomThemeSchema()
const { resetThemeMode, changeResetThemeMode, resetCustomTheme } = useCustomThemeReset()
</script>

<template>
  <SettingsCard v-if="isSelectedThemeCustom" :title="$t(SETTINGS_PAGE_APPEARANCE_I18N.themeColors)">
    <div class="settings-theme-card">
      <div class="settings-theme-card__reset">
        <NmorphSelectButton
          :aria-label="$t(SETTINGS_PAGE_APPEARANCE_I18N.resetThemeSource)"
          :model-value="resetThemeMode"
          @update:model-value="changeResetThemeMode"
        >
          <NmorphSelectButtonItem
            v-for="option in CUSTOM_THEME_RESET_OPTIONS"
            :key="option.value"
            :aria-label="$t(option.label)"
            :value="option.value"
          >
            <NmorphIcon size="small" aria-hidden="true">
              <component :is="option.icon" />
            </NmorphIcon>
          </NmorphSelectButtonItem>
        </NmorphSelectButton>

        <NmorphButton :text="$t(SETTINGS_PAGE_APPEARANCE_I18N.resetTheme)" @click="resetCustomTheme" />
      </div>

      <NmorphDivider class="settings-theme-card__divider" />

      <template v-for="(group, index) in CUSTOM_THEME_COLOR_GROUPS" :key="group.id">
        <NmorphDivider v-if="index > 0" class="settings-theme-card__divider" />

        <label v-for="item in group.items" :key="item.id" class="settings-theme-card__field">
          <NmorphText>{{ $t(item.label) }}</NmorphText>
          <NmorphColorPicker
            :model-value="effectiveTheme.colorSchema[item.id]"
            show-value
            @update:model-value="($event) => changeThemeColor(item.id, $event)"
          />
        </label>
      </template>

      <NmorphDivider class="settings-theme-card__divider" />

      <label v-for="item in CUSTOM_THEME_SHADOW_ITEMS" :key="item.id" class="settings-theme-card__slider">
        <div class="settings-theme-card__slider-label">
          <NmorphText as="small" variant="body-small">{{
            `${$t(item.label)} ${effectiveTheme[item.id]}${item.unit}`
          }}</NmorphText>
        </div>
        <NmorphSlider
          :model-value="effectiveTheme[item.id]"
          :min="item.min"
          :max="item.max"
          :step="item.step"
          :show-tooltip="false"
          @update:model-value="changeThemeShadowSetting(item.id, Number($event))"
        />
      </label>
    </div>
  </SettingsCard>
</template>

<style>
.settings-theme-card {
  display: grid;
  gap: 12px;
}

.settings-theme-card__reset {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.settings-theme-card__divider {
  margin: 12px 0;
}

.settings-theme-card__field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.settings-theme-card__slider {
  display: block;
  margin-bottom: 12px;
}

.settings-theme-card__slider-label {
  display: block;
  margin-bottom: 12px;
  text-align: right;
}
</style>
