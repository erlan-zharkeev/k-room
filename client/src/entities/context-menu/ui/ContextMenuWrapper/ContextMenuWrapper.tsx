import './style.scss'

import { useContextMenu } from '../../hooks'

import { MessageContextMenu } from './elements'

export const ContextMenuWrapper = () => {
  const { name, coord, reset } = useContextMenu()

  const menus: Record<string, JSX.Element> = {
    message: <MessageContextMenu />
  }

  const currentMenu = menus[name]

  const Content = () => currentMenu || null

  return (
    <div
      className="context-menu-wrapper"
      style={{
        opacity: currentMenu ? '1' : '0'
      }}
      onClick={reset}
    >
      {
        <div
          className="context-menu-wrapper__body"
          style={{
            opacity: currentMenu ? '1' : '0',
            left: coord.x,
            top: coord.y
          }}
        >
          <Content />
        </div>
      }
    </div>
  )
}
