<script setup lang="ts">
import { NmorphFileUpload, NmorphSelectButton, NmorphSlider } from '@nmorph/nmorph-ui-kit'
import { computed } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useI18n } from 'src/shared/lib'
import { AppText } from 'src/shared/ui'

import {
  SETTINGS_WALLPAPER_ALLOWED_TYPES,
  SETTINGS_WALLPAPER_ANGLE_MAX,
  SETTINGS_WALLPAPER_ANGLE_MIN,
  SETTINGS_WALLPAPER_SCALE_MAX,
  SETTINGS_WALLPAPER_SCALE_MIN,
  SETTINGS_WALLPAPER_DARKNESS_MAX,
  SETTINGS_WALLPAPER_DARKNESS_MIN,
  SETTINGS_WALLPAPER_VISIBILITY_OPTIONS
} from '../../../config/constants/wallpaper.constants'
import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../../config/i18n/appearance.i18n'
import { useWallpaper } from '../../../model/appearance/use-wallpaper.model'
import SettingsCard from '../../SettingsCard.vue'

const { t } = useI18n()
const {
  uploadKey,
  setWallpaperVisibility,
  setAngle,
  setScale,
  setDarkness,
  showUnsupportedWallpaperFormatError,
  updateWallpaper,
  wallpaperUploadValue
} = useWallpaper()
const { effectiveTheme, settings, isSelectedThemeCustom } = useSettings()

const visibilityOptions = computed(() =>
  SETTINGS_WALLPAPER_VISIBILITY_OPTIONS.map((option) => ({ ...option, label: t(option.label) }))
)
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaper)">
    <div class="settings-wallpaper-card">
      <div class="settings-wallpaper-card__visibility settings-wallpaper-card__input-element">
        <AppText :selectable="false" :text="$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperEnabled)" />
        <NmorphSelectButton
          height="thick"
          :model-value="settings.appearance.showWallpaper ? 'show' : 'hide'"
          :options="visibilityOptions"
          @update:model-value="setWallpaperVisibility($event === 'show')"
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
          <AppText
            tag="small"
            :selectable="false"
            :text="`${$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperAngle)} ${effectiveTheme.wallpaper.angle}deg`"
            class="settings-wallpaper-card__slider-label"
          />
          <NmorphSlider
            :model-value="effectiveTheme.wallpaper.angle"
            :min="SETTINGS_WALLPAPER_ANGLE_MIN"
            :max="SETTINGS_WALLPAPER_ANGLE_MAX"
            :step="1"
            :show-tooltip="false"
            @update:model-value="setAngle"
          />
        </label>

        <label class="settings-wallpaper-card__input-element">
          <AppText
            tag="small"
            :selectable="false"
            :text="`${$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperScale)} ${effectiveTheme.wallpaper.scale}%`"
            class="settings-wallpaper-card__slider-label"
          />
          <NmorphSlider
            :model-value="effectiveTheme.wallpaper.scale"
            :min="SETTINGS_WALLPAPER_SCALE_MIN"
            :max="SETTINGS_WALLPAPER_SCALE_MAX"
            :step="1"
            :show-tooltip="false"
            @update:model-value="setScale"
          />
        </label>

        <label class="settings-wallpaper-card__input-element">
          <AppText
            tag="small"
            :selectable="false"
            :text="`${$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperDarkness)} ${effectiveTheme.wallpaper.darkness}%`"
            class="settings-wallpaper-card__slider-label"
          />
          <NmorphSlider
            :model-value="effectiveTheme.wallpaper.darkness"
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
<style lang="scss">
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
