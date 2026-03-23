import { SocketActionsType, EventCallsUpdatedType } from 'common-types'
import { useDispatch } from 'react-redux'

import { updateCalls } from 'src/entities/call'

import { socket } from 'src/shared/api'

export const useCallDataLoad = () => {
  const dispatch = useDispatch()

  const monitorCallDataLoading = () => {
    socket.on<SocketActionsType>('calls-data-loaded', (payload: EventCallsUpdatedType) => {
      dispatch(updateCalls(payload))
    })
  }

  return { monitorCallDataLoading }
}
