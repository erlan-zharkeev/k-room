import type { FileUploadSelectEvent } from 'primevue/fileupload'
import { computed, ref, watch } from 'vue'

import { useSettings } from 'src/entities/setting'
import { readFileAsDataUrl, useI18n } from 'src/shared/lib'

import { SETTINGS_WALLPAPER_MAX_FILE_SIZE } from '../../config/constants'
import { SETTINGS_PAGE_APPEARANCE_I18N } from '../../config/i18n/appearance'

export const useSettingsWallpaperCard = () => {
  const { settings, selectedWallpaper, shallowUpdate } = useSettings()
  const { t } = useI18n()
  const wallpaperError = ref('')
  const wallpaperDarkness = ref(settings.value.customWallpaperDarkness)
  const wallpaperVisibility = ref<'show' | 'hide'>('hide')

  const isCustomTheme = computed(() => settings.value.theme === 'custom')
  const hasCustomWallpaper = computed(() => Boolean(settings.value.customWallpaperDataUrl))
  const isWallpaperVisible = computed(() => {
    if (isCustomTheme.value && !hasCustomWallpaper.value) return false

    return settings.value.showWallpaper
  })
  const hasWallpaperPreview = computed(() => isCustomTheme.value && Boolean(selectedWallpaper.value))

  watch(
    () => settings.value.customWallpaperDarkness,
    (value) => {
      wallpaperDarkness.value = value
    },
    { immediate: true }
  )

  watch(
    isWallpaperVisible,
    (value) => {
      wallpaperVisibility.value = value ? 'show' : 'hide'
    },
    { immediate: true }
  )

  const changeWallpaperVisibility = (value: boolean) => {
    if (value && isCustomTheme.value && !hasCustomWallpaper.value) return
    if (value === settings.value.showWallpaper) return

    void shallowUpdate({ showWallpaper: value })
  }

  const changeWallpaperDarkness = (value: number | string) => {
    const numericValue = Math.max(0, Math.min(100, Number(value) || 0))

    if (numericValue === settings.value.customWallpaperDarkness) return

    void shallowUpdate({ customWallpaperDarkness: numericValue })
  }

  watch(wallpaperDarkness, (value) => {
    changeWallpaperDarkness(value)
  })

  watch(wallpaperVisibility, (value) => {
    changeWallpaperVisibility(value === 'show')
  })

  const uploadWallpaper = async ({ files }: FileUploadSelectEvent) => {
    const file = Array.isArray(files) ? files[0] : undefined

    wallpaperError.value = ''

    if (!file || !isCustomTheme.value) return

    if (!file.type.startsWith('image/')) {
      wallpaperError.value = t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperInvalidFormat)
      return
    }

    if (file.size > SETTINGS_WALLPAPER_MAX_FILE_SIZE) {
      wallpaperError.value = t(SETTINGS_PAGE_APPEARANCE_I18N.wallpaperInvalidSize)
      return
    }

    const dataUrl = await readFileAsDataUrl(file)

    if (!dataUrl) return

    await shallowUpdate({
      wallpaper: 'custom',
      customWallpaperDataUrl: dataUrl,
      showWallpaper: true
    })
  }

  const resetWallpaper = async () => {
    wallpaperError.value = ''

    await shallowUpdate({
      wallpaper: 'default',
      customWallpaperDataUrl: '',
      showWallpaper: false
    })
  }

  return {
    isCustomTheme,
    hasCustomWallpaper,
    hasWallpaperPreview,
    isWallpaperVisible,
    wallpaperDarkness,
    wallpaperVisibility,
    wallpaperError,
    wallpaperPreviewUrl: selectedWallpaper,
    uploadWallpaper,
    resetWallpaper
  }
}
