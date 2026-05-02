<script setup lang="ts">
import { isNumber } from 'lodash'
import { FileUpload, SelectButton, Button, Slider } from 'primevue'
import { computed } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useI18n, useScreen } from 'src/shared/lib'
import { AppHeader, AppText } from 'src/shared/ui'

import {
  SETTINGS_WALLPAPER_ACCEPT,
  SETTINGS_WALLPAPER_ANGLE_MAX,
  SETTINGS_WALLPAPER_ANGLE_MIN,
  SETTINGS_WALLPAPER_MAX_FILE_SIZE,
  SETTINGS_WALLPAPER_SCALE_MAX,
  SETTINGS_WALLPAPER_SCALE_MIN,
  SETTINGS_WALLPAPER_DARKNESS_MAX,
  SETTINGS_WALLPAPER_DARKNESS_MIN,
  SETTINGS_WALLPAPER_VISIBILITY_OPTIONS
} from '../../config/constants'
import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../config/i18n/appearance'
import { useWallpaperSettings } from '../../model/theme/use-wallpaper-settings'
import SettingsCard from '../SettingsCard.vue'

const { t } = useI18n()
const { isMobile } = useScreen()
const { setWallpaperAppearance, setAngle, setScale, setDarkness, uploadWallpaper, resetWallpaper } =
  useWallpaperSettings()
const { effectiveTheme, settings, isSelectedThemeCustom } = useSettings()

const selectButtonPt = computed(() => ({
  root: {
    class: 'settings-wallpaper-card__visibility-select',
    'aria-label': t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperEnabled)
  }
}))
</script>

<template>
  <SettingsCard :title="$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaper)">
    <div class="settings-wallpaper-card">
      <div class="settings-wallpaper-card__visibility settings-wallpaper-card__input-element">
        <AppText :text="$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperEnabled)" />
        <SelectButton
          :fluid="isMobile"
          :model-value="settings.appearance.showWallpaper ? 'show' : 'hide'"
          :option-value="'value'"
          :options="SETTINGS_WALLPAPER_VISIBILITY_OPTIONS"
          :pt="selectButtonPt"
          size="small"
          :allow-empty="false"
          @update:model-value="($event) => setWallpaperAppearance($event === 'show')"
        >
          <template #option="{ option }">
            <AppHeader
              tag="h5"
              :text="
                option.value === 'show'
                  ? $t(SETTINGS_PAGE_APPEARANCE_I18N.show)
                  : $t(SETTINGS_PAGE_APPEARANCE_I18N.hide)
              "
            />
          </template>
        </SelectButton>
      </div>

      <div class="settings-wallpaper-card__additional" v-if="isSelectedThemeCustom">
        <div class="settings-wallpaper-card__upload settings-wallpaper-card__input-element">
          <div class="settings-wallpaper-card__upload-main">
            <FileUpload
              mode="basic"
              auto
              :accept="SETTINGS_WALLPAPER_ACCEPT"
              :max-file-size="SETTINGS_WALLPAPER_MAX_FILE_SIZE"
              :multiple="false"
              :choose-label="$t(SETTINGS_PAGE_APPEARANCE_I18N.uploadWallpaper)"
              class="settings-wallpaper-card__file-button"
              :choose-button-props="{
                text: true,
                size: 'small'
              }"
              @select="uploadWallpaper"
            />
            <AppText
              tag="small"
              truncate
              :text="effectiveTheme.wallpaper.filename"
              class="settings-wallpaper-card__file-label"
            />
          </div>

          <Button
            :label="$t(SETTINGS_PAGE_APPEARANCE_I18N.resetWallpaper)"
            size="small"
            text
            type="button"
            @click="resetWallpaper"
          />
        </div>

        <label class="settings-wallpaper-card__slider settings-wallpaper-card__input-element">
          <div class="settings-wallpaper-card__slider-header">
            <AppText tag="small" :text="$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperAngle)" />
            <AppText tag="small" :text="`${effectiveTheme.wallpaper.angle}deg`" />
          </div>
          <Slider
            :model-value="effectiveTheme.wallpaper.angle"
            :min="SETTINGS_WALLPAPER_ANGLE_MIN"
            :max="SETTINGS_WALLPAPER_ANGLE_MAX"
            :step="1"
            @update:model-value="
              ($event) => {
                isNumber($event) && setAngle($event)
              }
            "
          />
        </label>

        <label class="settings-wallpaper-card__slider settings-wallpaper-card__input-element">
          <div class="settings-wallpaper-card__slider-header">
            <AppText tag="small" :text="$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperScale)" />
            <AppText tag="small" :text="`${effectiveTheme.wallpaper.scale}%`" />
          </div>
          <Slider
            :model-value="effectiveTheme.wallpaper.scale"
            :min="SETTINGS_WALLPAPER_SCALE_MIN"
            :max="SETTINGS_WALLPAPER_SCALE_MAX"
            :step="1"
            @update:model-value="
              ($event) => {
                isNumber($event) && setScale($event)
              }
            "
          />
        </label>

        <label class="settings-wallpaper-card__slider settings-wallpaper-card__input-element">
          <div class="settings-wallpaper-card__slider-header">
            <AppText tag="small" :text="$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperDarkness)" />
            <AppText tag="small" :text="`${effectiveTheme.wallpaper.darkness}%`" />
          </div>
          <Slider
            :model-value="effectiveTheme.wallpaper.darkness"
            :min="SETTINGS_WALLPAPER_DARKNESS_MIN"
            :max="SETTINGS_WALLPAPER_DARKNESS_MAX"
            :step="1"
            @update:model-value="
              ($event) => {
                isNumber($event) && setDarkness($event)
              }
            "
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

.settings-wallpaper-card__visibility,
.settings-wallpaper-card__upload {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.settings-wallpaper-card__additional {
  display: grid;
}

.settings-wallpaper-card__input-element {
  margin-bottom: 12px;
}

.settings-wallpaper-card__upload-main {
  display: flex;
  gap: 8px;
  align-items: center;
}

.settings-wallpaper-card__slider-header {
  margin-bottom: 12px;
  text-align: right;
}
</style>
