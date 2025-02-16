import { ReactNode } from 'react'
import { useTypedSelector } from 'src/hooks'

export const WidgetWrapper = ({
  loading,
  isMain = false,
  children
}: {
  loading?: boolean
  isMain?: boolean
  children?: ReactNode
}) => {
  const { showWallpaper, theme } = useTypedSelector((state) => state.persist.settings)
  const loaderModifier = loading ? 'show' : 'hide'

  return (
    <div className={`widget-wrapper widget-wrapper--${theme}`}>
      {showWallpaper && <div className={`widget-wallpaper widget-wallpaper--${isMain ? 'main' : 'default'}`} />}
      <div className={`widget-loader widget-loader--${loaderModifier}`}>
        {showWallpaper && <div className={`widget-wallpaper widget-wallpaper--${isMain ? 'main' : 'default'}`} />}
        <div className="loading-container" />
      </div>
      {children}
    </div>
  )
}
