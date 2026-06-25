import { computed } from 'vue'

import { useSettings } from 'src/entities/setting'
import { useI18n } from 'src/shared/lib'

import { SETTINGS_WALLPAPER_VISIBILITY_OPTIONS } from '../../config/constants/wallpaper.constants'

import { useWallpaper } from './use-wallpaper.model'

export const useWallpaperCard = () => {
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
  const wallpaperVisibilityValue = computed(() => (settings.value.appearance.showWallpaper ? 'show' : 'hide'))
  const hasWallpaper = computed(() => {
    const { filename, url } = effectiveTheme.value.wallpaper

    return Boolean(filename && url)
  })

  const updateWallpaperVisibility = (value: string | number) => {
    setWallpaperVisibility(value === 'show')
  }

  return {
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
  }
}
