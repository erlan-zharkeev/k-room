import { useDispatch } from 'react-redux'

import { ContextMenuNameType, IContextClickedObject } from 'src/shared/context-menu'
import { resetContextMenuToInitial, setContextMenu, useSystem } from 'src/shared/system'

export const useContextMenu = () => {
  const dispatch = useDispatch()
  const { contextMenu } = useSystem()

  const setMenu = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent> | null,
    name: ContextMenuNameType,
    contextClickedObject: IContextClickedObject
  ) => {
    if (!event) return
    event.preventDefault()
    const coord = {
      x: event.pageX,
      y: event.pageY
    }
    dispatch(setContextMenu({ coord, name, contextClickedObject }))
  }

  const reset = () => {
    dispatch(resetContextMenuToInitial())
  }

  return {
    ...contextMenu,
    reset,
    setMenu
  }
}
