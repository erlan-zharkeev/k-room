import { isString } from 'global-shared'
import { computed, watch } from 'vue'
import { useRouter, LocationQueryValue, useRoute } from 'vue-router'

import { useSettings } from 'src/entities/setting'
import { useScreen } from 'src/shared/lib'

import { isContentTitleKey } from '../content-layout/types'
import { isContentNavigationTitleKey } from '../content-navigation-layout/types'

import { CONTENT_LAYOUT_EXCLUDED_ROUTE_SEGMENTS } from './constants'

export const useAppLayout = () => {
  const router = useRouter()
  const route = useRoute()
  const { isPortraitTabletOrLess } = useScreen()
  const { effectiveTheme, settings } = useSettings()

  const isSupportedTabletAppLayoutView = (view?: LocationQueryValue | LocationQueryValue[]) =>
    isString(view) && ['content', 'content-navigation'].includes(view)

  watch(
    isPortraitTabletOrLess,
    (tablet) => {
      if (tablet) {
        if (isSupportedTabletAppLayoutView(route.query.view)) return

        router.replace({ query: { ...route.query, view: 'content-navigation' } })
        return
      }

      if (!('view' in route.query)) return

      const { view: _, ...rest } = route.query

      router.replace({ query: rest })
    },
    { immediate: true }
  )

  const segments = computed(() => route.path.split('/').filter(Boolean))

  const navigationTitleKey = computed(() => {
    const titleKey = segments.value[1]
    return isContentNavigationTitleKey(titleKey) ? titleKey : undefined
  })

  const contentTitleKey = computed(() => {
    const titleKey = segments.value[2]
    return isContentTitleKey(titleKey) ? titleKey : undefined
  })

  const showNavigation = computed(() => !isPortraitTabletOrLess.value || route.query.view === 'content-navigation')
  const showContent = computed(() => !isPortraitTabletOrLess.value || route.query.view !== 'content-navigation')
  const showWallpaper = computed(
    () => settings.value.appearance.showWallpaper && Boolean(effectiveTheme.value.wallpaper.url)
  )
  const isContentLayoutEnabled = computed(() => {
    const contentRouteSegment = segments.value[1]

    return !contentRouteSegment || !CONTENT_LAYOUT_EXCLUDED_ROUTE_SEGMENTS.includes(contentRouteSegment)
  })

  const wallpaperStyle = computed(() => {
    return {
      '--app-layout-wallpaper': `url(${effectiveTheme.value.wallpaper.url})`,
      '--app-layout-wallpaper-transform': `translate(-50%, -50%)rotate(${
        effectiveTheme.value.wallpaper.angle
      }deg) scale(${effectiveTheme.value.wallpaper.scale / 100})`,
      '--app-layout-wallpaper-brightness': `brightness(${100 - effectiveTheme.value.wallpaper.darkness}%)`
    }
  })

  return {
    navigationTitleKey,
    contentTitleKey,
    showNavigation,
    showContent,
    showWallpaper,
    isContentLayoutEnabled,
    wallpaperStyle
  }
}
