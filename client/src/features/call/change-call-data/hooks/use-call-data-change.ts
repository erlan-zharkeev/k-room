import { SocketActionsType, EventCallUpdatedType } from 'common-types'
import { useDispatch } from 'react-redux'

import { updateCall } from 'src/entities/call'

import { socket } from 'src/shared/api'

export const useCallDataChange = () => {
  const dispatch = useDispatch()

  const monitorCallDataChanging = () => {
    const handleCallChanged = (payload: EventCallUpdatedType) => {
      dispatch(updateCall(payload))
    }

    socket.on<SocketActionsType>('call-data-changed', handleCallChanged)

    return () => {
      socket.off<SocketActionsType>('call-data-changed', handleCallChanged)
    }
  }

  return { monitorCallDataChanging }
}
