import useTypedSelector from 'src/hooks/useTypedSelector'
import MessageContextMenu from './Components/MessageContextMenu/MessageContextMenu'
import { firstCharUpperCase } from 'src/utils/firstCharUpperCase'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { setContextMenu } from 'src/store/systemSlice'

export const ContextMenu = () => {
  const { contextMenu } = useTypedSelector((state) => state.system)

  const dispatch = useDispatch<AppDispatch>()

  const menus: Record<string, JSX.Element> = {
    Message: <MessageContextMenu />
  }

  const currentMenu = menus[firstCharUpperCase(contextMenu.slotName)]

  const Content = () => (currentMenu ? currentMenu : null)

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

export default ContextMenu
