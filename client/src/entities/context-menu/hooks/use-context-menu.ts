import { useDispatch } from 'react-redux'
import { setContextMenu } from 'src/entities/system'

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
    reset
  }
}
