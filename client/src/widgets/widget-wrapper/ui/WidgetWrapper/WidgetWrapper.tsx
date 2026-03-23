import './style.scss'
import { ReactNode } from 'react'

import { useSettings } from 'src/entities/settings'
import { createClassNameWithModifiers } from 'src/shared/utils'

export const WidgetWrapper = ({
  name,
  children
}: {
  name: 'top-bar' | 'aside-bar' | 'bottom-bar' | 'aside-panel' | 'content'
  children?: ReactNode
}) => {
  const { showWallpaper, theme } = useSettings()
  const className = createClassNameWithModifiers({
    rootClass: 'widget-wrapper',
    modifiers: [theme],
    additionalClassName: name
  })
  const wallpaperClassName = createClassNameWithModifiers({
    rootClass: 'widget-wallpaper',
    modifiers: [name]
  })

  return (
    <div className={className}>
      {showWallpaper && <div className={wallpaperClassName} />}
      <div className="widget-wrapper__children">{children}</div>
    </div>
  )
}
