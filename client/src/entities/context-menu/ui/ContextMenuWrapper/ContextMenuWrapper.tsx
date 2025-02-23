import './style.scss'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/app/store'
import { MessageContextMenu } from './elements'
import { firstCharUpperCase } from 'src/shared/utils'
import { setContextMenu } from 'src/entities/system'
import { useTypedSelector } from 'src/shared/lib'

export const ContextMenuWrapper = () => {
  const { contextMenu } = useTypedSelector((state) => state.system)

  const dispatch = useDispatch<AppDispatch>()

  const menus: Record<string, JSX.Element> = {
    Message: <MessageContextMenu />
  }

  const currentMenu = menus[firstCharUpperCase(contextMenu.slotName)]

  const Content = () => currentMenu || null

  return (
    <div
      className="context-menu-wrapper"
      style={{
        opacity: currentMenu ? '1' : '0'
      }}
      onClick={() => dispatch(setContextMenu({ event: null, type: '' }))}
    >
      {
        <div
          className="context-menu-wrapper__body"
          style={{
            opacity: currentMenu ? '1' : '0',
            left: contextMenu.coord.x,
            top: contextMenu.coord.y
          }}
        >
          <Content />
        </div>
      }
    </div>
  )
}
