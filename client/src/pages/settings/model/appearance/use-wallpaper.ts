import type { INmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import { computed, ref } from 'vue'

import { useSettings } from 'src/entities/setting'
import { TOAST_I18N } from 'src/shared/config'
import { getDataUrlMimeType, isEmptyFileWithName, readFileAsDataUrl, useI18n } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib/toast'

import { SETTINGS_WALLPAPER_MAX_FILE_SIZE } from '../../config/constants/wallpaper.constants'
import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../config/i18n/appearance.i18n'

export const useWallpaper = () => {
  const { effectiveTheme, settings, setByPath } = useSettings()
  const { t } = useI18n()
  const toast = useAppToast()
  const uploadKeySource = ref(0)
  const wallpaperPath = computed(() => `appearance.themes.${settings.value.appearance.selectedTheme}.wallpaper.`)
  const uploadKey = computed(() => {
    const { filename, url } = effectiveTheme.value.wallpaper

    return `${uploadKeySource.value}-${settings.value.appearance.selectedTheme}-${filename}-${url.length}`
  })
  const wallpaperUploadValue = computed(() => {
    const { filename, url } = effectiveTheme.value.wallpaper
    if (!filename || !url) return []

    return [
      {
        data: new File([], filename, { type: getDataUrlMimeType(url) }),
        previewUrl: url
      }
    ]
  })

  const setWallpaperVisibility = (value: boolean) => setByPath('appearance.showWallpaper', value)

  const setAngle = (value: number) => setByPath(`${wallpaperPath.value}angle`, value)
  const setScale = (value: number) => setByPath(`${wallpaperPath.value}scale`, value)
  const setDarkness = (value: number) => setByPath(`${wallpaperPath.value}darkness`, value)
  const setWallpaperFileValue = (path: string, value: string) => setByPath(`${wallpaperPath.value}${path}`, value)

  const showUnsupportedWallpaperFormatError = () => {
    toast.add({
      type: 'error',
      title: t(TOAST_I18N.error),
      content: t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperInvalidFormat)
    })
  }

  const showWallpaperInvalidSizeError = () => {
    toast.add({
      type: 'error',
      title: t(TOAST_I18N.error),
      content: t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperInvalidSize)
    })
  }

  const resetUpload = () => {
    uploadKeySource.value += 1
  }

  const resetWallpaper = () => {
    setWallpaperFileValue('url', '')
    setWallpaperFileValue('filename', '')
    resetUpload()
  }

  const updateWallpaper = async (files: INmorphCustomFileData[]) => {
    const file = files[files.length - 1]?.data
    if (!file) {
      resetWallpaper()
      return
    }
    if (isEmptyFileWithName(file, effectiveTheme.value.wallpaper.filename)) return

    if (file.size > SETTINGS_WALLPAPER_MAX_FILE_SIZE) {
      showWallpaperInvalidSizeError()
      resetUpload()
      return
    }

    const dataUrl = await readFileAsDataUrl(file)
    if (!dataUrl) return
    setWallpaperFileValue('url', dataUrl)
    setWallpaperFileValue('filename', file.name)
    resetUpload()
  }

  return {
    uploadKey,
    wallpaperUploadValue,
    setWallpaperVisibility,
    setAngle,
    setScale,
    setDarkness,
    showUnsupportedWallpaperFormatError,
    updateWallpaper
  }
}
