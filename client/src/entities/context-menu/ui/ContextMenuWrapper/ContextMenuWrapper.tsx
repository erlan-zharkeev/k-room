import './style.scss'
import { useDispatch } from 'react-redux'

import { AppDispatch } from 'src/app/store'

import { setContextMenu } from 'src/entities/system'

import { firstCharUpperCase } from 'src/shared/utils'

import { useContextMenu } from '../../hooks'

import { MessageContextMenu } from './elements'

export const ContextMenuWrapper = () => {
  const { slotName, coord } = useContextMenu()

  const dispatch = useDispatch<AppDispatch>()

  const menus: Record<string, JSX.Element> = {
    IMessage: <MessageContextMenu />
  }

  const currentMenu = menus[firstCharUpperCase(slotName)]

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
