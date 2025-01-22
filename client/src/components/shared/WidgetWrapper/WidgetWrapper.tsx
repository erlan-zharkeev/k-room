import { Theme } from 'common-types'
import { ReactNode } from 'react'
import { WallpaperMainDark, WallpaperMainLight, WallpaperAsideLight, WallpaperAsideDark, WallpaperTopLight, WallpaperTopDark } from 'src/assets'
import { useTypedSelector } from 'src/hooks'

const wallpaperMap = {
  aside: {
    [Theme.dark]: WallpaperAsideDark,
    [Theme.light]: WallpaperAsideLight
  },
  main: {
    [Theme.dark]: WallpaperMainDark,
    [Theme.light]: WallpaperMainLight
  },
  top: {
    [Theme.dark]: WallpaperTopDark,
    [Theme.light]: WallpaperTopLight
  },
  left: {
    [Theme.dark]: WallpaperTopDark,
    [Theme.light]: WallpaperTopLight
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
      <div className={`widget-loader widget-loader--${loaderModifier}`} >
        {wallpaper}
        <div className="loading-container" />
      </div>
      {children}
    </div>
  )
}
