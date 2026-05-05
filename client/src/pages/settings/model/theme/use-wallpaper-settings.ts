import { computed, ref } from 'vue'

import { useSettings } from 'src/entities/setting'
import { TOAST_I18N } from 'src/shared/config'
import { getDataUrlMimeType, isEmptyFileWithName, readFileAsDataUrl, useI18n } from 'src/shared/lib'
import { useAppToast } from 'src/shared/lib/toast'

import { SETTINGS_WALLPAPER_MAX_FILE_SIZE } from '../../config/constants'
import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../config/i18n/appearance'

export const useWallpaperSettings = () => {
  const { effectiveTheme, settings, setByPath } = useSettings()
  const { t } = useI18n()
  const toast = useAppToast()
  const uploadKey = ref(0)
  const basicPath = computed(() => `appearance.themes.${settings.value.appearance.selectedTheme}.wallpaper.`)
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

  const setWallpaperAppearance = (value: boolean) => setByPath('appearance.showWallpaper', value)

  const setAngle = (value: number) => setByPath(`${basicPath.value}angle`, value)
  const setScale = (value: number) => setByPath(`${basicPath.value}scale`, value)
  const setDarkness = (value: number) => setByPath(`${basicPath.value}darkness`, value)
  const setWallpaperFileValue = (path: string, value: string) => setByPath(`${basicPath.value}${path}`, value)

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
    uploadKey.value += 1
  }

  const resetWallpaper = () => {
    setWallpaperFileValue('url', '')
    setWallpaperFileValue('filename', '')
    resetUpload()
  }

  const updateWallpaper = async (files: File[]) => {
    const file = files[files.length - 1]
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
    setWallpaperAppearance,
    setAngle,
    setScale,
    setDarkness,
    showUnsupportedWallpaperFormatError,
    updateWallpaper
  }
}
