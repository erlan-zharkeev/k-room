import { SocketActionsType, EventCallsUpdatedType } from 'common'
import { useDispatch } from 'react-redux'

import { updateCalls } from 'src/entities/call'

import { socket } from 'src/shared/api'

export const useCallDataLoad = () => {
  const dispatch = useDispatch()

  const monitorCallDataLoading = () => {
    const handleCallsLoaded = (payload: EventCallsUpdatedType) => {
      dispatch(updateCalls(payload))
    }

    socket.on<SocketActionsType>('calls-data-loaded', handleCallsLoaded)

    return () => {
      socket.off<SocketActionsType>('calls-data-loaded', handleCallsLoaded)
    }
  }

  return { monitorCallDataLoading }
}
