import { ReactNode } from 'react'
import {
  WallpaperMainDark,
  WallpaperMainLight,
  WallpaperAsideLight,
  WallpaperAsideDark,
  WallpaperTopLight,
  WallpaperTopDark
} from 'src/assets'
import { useTypedSelector } from 'src/hooks'

const wallpaperMap = {
  aside: {
    dark: WallpaperAsideDark,
    light: WallpaperAsideLight
  },
  main: {
    dark: WallpaperMainDark,
    light: WallpaperMainLight
  },
  top: {
    dark: WallpaperTopDark,
    light: WallpaperTopLight
  },
  left: {
    dark: WallpaperTopDark,
    light: WallpaperTopLight
  }
}

export const WidgetWrapper = ({
  wallpaperPlacement,
  loading,
  children
}: {
  wallpaperPlacement: keyof typeof wallpaperMap
  loading?: boolean
  children?: ReactNode
}) => {
  const { showWallpaper, theme } = useTypedSelector((state) => state.persist.settings)
  const src = wallpaperMap[wallpaperPlacement][theme]
  const loaderModifier = loading ? 'show' : 'hide'
  const wallpaper = (
    <div>
      {showWallpaper && (
        <div className="widget-wallpaper">
          <img src={src} alt={src} />
        </div>
      )}
    </div>
  )

  return (
    <div className="widget-wrapper">
      {wallpaper}
      <div className={`widget-loader widget-loader--${loaderModifier}`}>
        {wallpaper}
        <div className="loading-container" />
      </div>
      {children}
    </div>
  )
}
