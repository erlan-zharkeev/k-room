import type { FileUploadSelectEvent } from 'primevue/fileupload'
import { computed } from 'vue'

import { useSettings } from 'src/entities/setting'
import { readFileAsDataUrl } from 'src/shared/lib'

export const useWallpaperSettings = () => {
  const { settings, setByPath } = useSettings()
  const basicPath = computed(() => `appearance.themes.${settings.value.appearance.selectedTheme}.wallpaper.`)

  const setWallpaperAppearance = (value: boolean) => setByPath(`${basicPath.value}show`, value)
  const setFit = (value: number) => setByPath(`${basicPath.value}fit`, value)
  const setAngle = (value: number) => setByPath(`${basicPath.value}angle`, value)
  const setScale = (value: number) => setByPath(`${basicPath.value}scale`, value)
  const setDarkness = (value: number) => setByPath(`${basicPath.value}darkness`, value)
  const setWallpaperFileValue = (path: string, value: string) => setByPath(`${basicPath}${path}`, value)

  const uploadWallpaper = async ({ files }: FileUploadSelectEvent) => {
    const file = Array.isArray(files) ? files[0] : undefined
    if (!file) return
    const dataUrl = await readFileAsDataUrl(file)
    if (!dataUrl) return
    setWallpaperFileValue('url', dataUrl)
    setWallpaperFileValue('filename', file.name)
  }

  const resetWallpaper = async () => {
    setWallpaperFileValue('url', '')
    setWallpaperFileValue('filename', '')
  }

  return {
    setWallpaperAppearance,
    setFit,
    setAngle,
    setScale,
    setDarkness,
    uploadWallpaper,
    resetWallpaper
  }
}
