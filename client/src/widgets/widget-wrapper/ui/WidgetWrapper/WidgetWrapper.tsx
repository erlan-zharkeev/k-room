import './style.scss'
import { ReactNode } from 'react'

import { useSettings } from 'src/entities/settings'

export const WidgetWrapper = ({
  name,
  children
}: {
  name: 'top-bar' | 'aside-bar' | 'bottom-bar' | 'aside-panel' | 'content'
  children?: ReactNode
}) => {
  const { showWallpaper, theme } = useSettings()

  return (
    <div className={`${name} widget-wrapper widget-wrapper--${theme}`}>
      {showWallpaper && <div className={`widget-wallpaper widget-wallpaper--${name}`} />}
      <div className="widget-wrapper__children">{children}</div>
    </div>
  )
}
