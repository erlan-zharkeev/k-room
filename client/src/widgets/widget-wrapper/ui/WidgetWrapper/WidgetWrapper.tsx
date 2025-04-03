import './style.scss'
import { ReactNode } from 'react'
import { useTypedSelector } from 'src/shared/lib'

export const WidgetWrapper = ({
  loading,
  placement = 'top',
  children
}: {
  loading?: boolean
  placement: 'top' | 'aside-bar' | 'bottom-bar' | 'aside-panel' | 'main'
  children?: ReactNode
}) => {
  const { showWallpaper, theme } = useTypedSelector((state) => state.persist.settings)
  const loaderModifier = loading ? 'show' : 'hide'

  return (
    <div className={`widget-wrapper widget-wrapper--${theme}`}>
      {showWallpaper && <div className={`widget-wallpaper widget-wallpaper--${placement}`} />}
      <div className={`widget-loader widget-loader--${loaderModifier}`}>
        {showWallpaper && <div className={`widget-wallpaper widget-wallpaper--${placement}`} />}
        <div className="loading-container" />
      </div>
      {children}
    </div>
  )
}
