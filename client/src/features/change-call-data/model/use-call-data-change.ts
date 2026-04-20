import { useDispatch } from 'react-redux'

import { SocketActionsType, EventCallUpdatedType } from 'common'

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
