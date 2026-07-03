<script setup lang="ts">
import { NmorphText, NmorphFileUpload, NmorphSelectButton, NmorphSlider } from '@nmorph/nmorph-ui-kit'

import {
  SETTINGS_WALLPAPER_ALLOWED_TYPES,
  SETTINGS_WALLPAPER_ANGLE_MAX,
  SETTINGS_WALLPAPER_ANGLE_MIN,
  SETTINGS_WALLPAPER_SCALE_MAX,
  SETTINGS_WALLPAPER_SCALE_MIN,
  SETTINGS_WALLPAPER_DARKNESS_MAX,
  SETTINGS_WALLPAPER_DARKNESS_MIN
} from '../../../config/constants/wallpaper.constants'
import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../../config/i18n/appearance.i18n'
import { useWallpaperCard } from '../../../model/appearance/use-wallpaper-card.model'
import SettingsCard from '../../SettingsCard.vue'

const {
  effectiveTheme,
  hasWallpaper,
  isSelectedThemeCustom,
  setAngle,
  setDarkness,
  setScale,
  showUnsupportedWallpaperFormatError,
  updateWallpaper,
  updateWallpaperVisibility,
  uploadKey,
  visibilityOptions,
  wallpaperUploadValue,
  wallpaperVisibilityValue
} = useWallpaperCard()
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaper)">
    <div class="settings-wallpaper-card">
      <div class="settings-wallpaper-card__visibility settings-wallpaper-card__input-element">
        <NmorphText>{{ $t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperEnabled) }}</NmorphText>
        <NmorphSelectButton
          thickness="thick"
          :model-value="wallpaperVisibilityValue"
          :options="visibilityOptions"
          @update:model-value="updateWallpaperVisibility"
        />
      </div>

      <div class="settings-wallpaper-card__additional" v-if="isSelectedThemeCustom">
        <div class="settings-wallpaper-card__upload settings-wallpaper-card__input-element">
          <NmorphFileUpload
            :key="uploadKey"
            :allowed-types="SETTINGS_WALLPAPER_ALLOWED_TYPES"
            :button-text="$t(SETTINGS_PAGE_APPEARANCE_I18N.uploadWallpaper)"
            :model-value="wallpaperUploadValue"
            :multiple="false"
            file-name-width="174px"
            @update:model-value="updateWallpaper"
            @on-unsupported-file-type-error="showUnsupportedWallpaperFormatError"
          />
        </div>

        <label class="settings-wallpaper-card__input-element">
          <NmorphText as="small" class="settings-wallpaper-card__slider-label" variant="body-small">{{
            `${$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperAngle)} ${effectiveTheme.wallpaper.angle}deg`
          }}</NmorphText>
          <NmorphSlider
            :model-value="effectiveTheme.wallpaper.angle"
            :disabled="!hasWallpaper"
            :min="SETTINGS_WALLPAPER_ANGLE_MIN"
            :max="SETTINGS_WALLPAPER_ANGLE_MAX"
            :step="1"
            :show-tooltip="false"
            @update:model-value="setAngle"
          />
        </label>

        <label class="settings-wallpaper-card__input-element">
          <NmorphText as="small" class="settings-wallpaper-card__slider-label" variant="body-small">{{
            `${$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperScale)} ${effectiveTheme.wallpaper.scale}%`
          }}</NmorphText>
          <NmorphSlider
            :model-value="effectiveTheme.wallpaper.scale"
            :disabled="!hasWallpaper"
            :min="SETTINGS_WALLPAPER_SCALE_MIN"
            :max="SETTINGS_WALLPAPER_SCALE_MAX"
            :step="1"
            :show-tooltip="false"
            @update:model-value="setScale"
          />
        </label>

        <label class="settings-wallpaper-card__input-element">
          <NmorphText as="small" class="settings-wallpaper-card__slider-label" variant="body-small">{{
            `${$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperDarkness)} ${effectiveTheme.wallpaper.darkness}%`
          }}</NmorphText>
          <NmorphSlider
            :model-value="effectiveTheme.wallpaper.darkness"
            :disabled="!hasWallpaper"
            :min="SETTINGS_WALLPAPER_DARKNESS_MIN"
            :max="SETTINGS_WALLPAPER_DARKNESS_MAX"
            :step="1"
            :show-tooltip="false"
            @update:model-value="setDarkness"
          />
        </label>
      </div>
    </div>
  </SettingsCard>
</template>
<style lang="scss" scoped>
.settings-wallpaper-card {
  display: grid;
}

.settings-wallpaper-card__visibility {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.settings-wallpaper-card__upload {
  display: grid;
}

.settings-wallpaper-card__additional {
  display: grid;
}

.settings-wallpaper-card__input-element {
  margin-bottom: 12px;
}

.settings-wallpaper-card__slider-label {
  display: block;
  margin-bottom: 12px;
  text-align: right;
}
</style>
