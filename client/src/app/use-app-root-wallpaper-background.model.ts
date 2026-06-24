import { LAYOUT_ROUTE_NAMES } from 'global-shared'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useSettings } from 'src/entities/setting'

export const useAppRootWallpaperBackground = () => {
  const route = useRoute()
  const { effectiveTheme } = useSettings()
  const isAppRoute = computed(() => route.matched.some(({ path }) => path === LAYOUT_ROUTE_NAMES.app))
  const showAppRootWallpaperBackground = computed(
    () => !isAppRoute.value && Boolean(effectiveTheme.value.wallpaper.url)
  )
  const appRootWallpaperBackgroundStyle = computed(() => {
    if (!showAppRootWallpaperBackground.value) return undefined

    const { angle, darkness, scale, url } = effectiveTheme.value.wallpaper

    return {
      '--app-root-wallpaper': `url(${url})`,
      '--app-root-wallpaper-brightness': `brightness(${100 - darkness}%)`,
      '--app-root-wallpaper-transform': `translate(-50%, -50%) rotate(${angle}deg) scale(${scale / 100})`
    }
  })

  return {
    appRootWallpaperBackgroundStyle,
    showAppRootWallpaperBackground
  }
}
