<script setup lang="ts">
import { FileUpload, Message, SelectButton, Button } from 'primevue'
import { computed } from 'vue'

import { useI18n, useScreen } from 'src/shared/lib'
import { AppHeader, AppText } from 'src/shared/ui'

import {
  SETTINGS_WALLPAPER_ACCEPT,
  SETTINGS_WALLPAPER_MAX_FILE_SIZE,
  SETTINGS_WALLPAPER_VISIBILITY_OPTIONS
} from '../../config/constants'
import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../config/i18n/appearance'
import { useSettingsWallpaperCard } from '../../model/theme/use-settings-wallpaper-card'
import SettingsCard from '../SettingsCard.vue'

const { t } = useI18n()
const { isMobile } = useScreen()
const {
  isCustomTheme,
  hasCustomWallpaper,
  hasWallpaperPreview,
  wallpaperDarkness,
  wallpaperVisibility,
  wallpaperError,
  wallpaperPreviewUrl,
  uploadWallpaper,
  resetWallpaper
} = useSettingsWallpaperCard()

const wallpaperPreviewStyle = computed(() => ({
  '--settings-wallpaper-preview': `url(${wallpaperPreviewUrl.value})`,
  '--settings-wallpaper-preview-brightness': `brightness(${100 - wallpaperDarkness.value}%)`
}))

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
      <div class="settings-wallpaper-card__visibility">
        <AppText :text="$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperEnabled)" />
        <SelectButton
          v-model="wallpaperVisibility"
          :data-key="'value'"
          :fluid="isMobile"
          :option-value="'value'"
          :options="SETTINGS_WALLPAPER_VISIBILITY_OPTIONS"
          :pt="selectButtonPt"
          size="small"
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

      <div v-if="hasWallpaperPreview" class="settings-wallpaper-card__preview-layout">
        <div class="settings-wallpaper-card__preview">
          <AppText tag="small" :text="$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperPreview)" />
          <div
            class="settings-wallpaper-card__image"
            :style="wallpaperPreviewStyle"
            :aria-label="$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperPreview)"
          />
        </div>

        <label class="settings-wallpaper-card__slider">
          <div class="settings-wallpaper-card__slider-header">
            <AppText tag="small" :text="$t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperDarkness)" />
            <AppText tag="small" :text="`${wallpaperDarkness}%`" />
          </div>
          <input v-model="wallpaperDarkness" min="0" max="100" step="1" type="range" />
        </label>
      </div>

      <div v-if="isCustomTheme" class="settings-wallpaper-card__actions">
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
        >
          <template #filelabel />
        </FileUpload>

        <Button
          v-if="hasCustomWallpaper"
          :label="$t(SETTINGS_PAGE_APPEARANCE_I18N.resetWallpaper)"
          size="small"
          text
          type="button"
          @click="resetWallpaper"
        />
      </div>

      <Message v-if="wallpaperError" severity="error" size="small" variant="simple">
        {{ wallpaperError }}
      </Message>
    </div>
  </SettingsCard>
</template>

<style lang="scss">
// .settings-wallpaper-card {
//   display: grid;
//   gap: 14px;
//   align-content: start;
// }

// .settings-wallpaper-card__visibility,
// .settings-wallpaper-card__actions {
//   display: flex;
//   gap: 12px;
//   align-items: center;
// }

// .settings-wallpaper-card__visibility {
//   flex-wrap: wrap;
//   justify-content: space-between;
// }

// .settings-wallpaper-card__actions {
//   flex-wrap: wrap;
// }

// .settings-wallpaper-card__visibility-select {
//   display: grid;
//   grid-auto-columns: minmax(0, 1fr);
//   grid-auto-flow: column;

//   width: auto;
//   max-width: 100%;

//   @include screen-mobile {
//     width: 100%;
//   }
// }

// .settings-wallpaper-card__visibility-select .p-togglebutton {
//   width: auto;
//   min-width: 0;
//   white-space: normal;
// }

// .settings-wallpaper-card__preview-layout {
//   display: grid;
//   grid-template-columns: minmax(0, 1fr) 240px;
//   gap: 14px;
//   align-items: start;

//   @include screen-mobile {
//     grid-template-columns: minmax(0, 1fr);
//   }
// }

// .settings-wallpaper-card__preview,
// .settings-wallpaper-card__slider {
//   display: grid;
//   gap: 8px;
// }

// .settings-wallpaper-card__slider {
//   align-content: start;
// }

// .settings-wallpaper-card__slider-header {
//   display: flex;
//   gap: 8px;
//   align-items: center;
//   justify-content: space-between;
// }

// .settings-wallpaper-card__image {
//   display: block;

//   width: 100%;
//   min-height: 160px;
//   max-height: 220px;
//   border: 1px solid var(--p-content-border-color);
//   border-radius: 8px;

//   background-color: var(--p-app-background);
//   background-image: var(--settings-wallpaper-preview);
//   background-repeat: repeat;
//   background-position: center;
//   background-size: 280px auto;
//   filter: var(--settings-wallpaper-preview-brightness);
// }

// .settings-wallpaper-card__slider input {
//   width: 100%;
// }

// .settings-wallpaper-card__file-button {
//   display: block;
// }

// .settings-wallpaper-card__file-button :deep(.p-button) {
//   min-height: 36px;
// }
</style>
