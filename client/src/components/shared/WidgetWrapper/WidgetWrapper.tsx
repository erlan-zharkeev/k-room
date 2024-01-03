import { Theme } from 'common-types'
import { ReactNode } from 'react'
import { WallpaperMainDark, WallpaperMainLight, WallpaperAsideLight, WallpaperAsideDark } from 'src/assets'
import { useTypedSelector } from 'src/hooks'

const wallpaperMap = {
  aside: {
    [Theme.dark]: WallpaperAsideDark,
    [Theme.light]: WallpaperAsideLight
  },
  main: {
    [Theme.dark]: WallpaperMainDark,
    [Theme.light]: WallpaperMainLight
  }
}

export const WidgetWrapper = ({
  loading,
  wallpaperPlacement,
  children
}: {
  loading: boolean
  wallpaperPlacement: keyof typeof wallpaperMap
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
        <div className="loading-container">
          <div className="loading-text">
            <span>L</span>
            <span>O</span>
            <span>A</span>
            <span>D</span>
            <span>I</span>
            <span>N</span>
            <span>G</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
