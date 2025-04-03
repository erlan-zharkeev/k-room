import { useDispatch } from 'react-redux'

import { setContextMenu } from 'src/entities/system'

import { useTypedSelector } from 'src/shared/lib'

export const useContextMenu = () => {
  const dispatch = useDispatch()

  const reset = () => {
    dispatch(
      setContextMenu({
        event: null,
        type: ''
      })
    )
  }

  return {
    reset,
    ...useTypedSelector((state) => state.system.contextMenu)
  }
}
