import { useDispatch } from 'react-redux'
import { useTypedSelector } from 'src/hooks'
import { AppDispatch } from 'src/store'
import { setContextMenu } from 'src/store/system-slice'
import { firstCharUpperCase } from 'src/utils'
import { MessageContextMenu } from './components'

export const ContextMenu = () => {
  const { contextMenu } = useTypedSelector((state) => state.system)

  const dispatch = useDispatch<AppDispatch>()

  const menus: Record<string, JSX.Element> = {
    Message: <MessageContextMenu />
  }

  const currentMenu = menus[firstCharUpperCase(contextMenu.slotName)]

  const Content = () => currentMenu || null

  return (
    <div
      className="context-menu"
      style={{
        opacity: currentMenu ? '1' : '0'
      }}
      onClick={() => dispatch(setContextMenu({ event: null, type: '' }))}
    >
      {
        <div
          className="context-menu__body"
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
