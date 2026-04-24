import { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { EventCallUpdatedType, EventCallsUpdatedType, SocketActionsType } from 'common'

import { socket } from 'src/shared/api'
import { updateCall, updateCalls } from 'src/shared/call-core'

export const useCallDataUpdateMonitor = () => {
  const dispatch = useDispatch()

  const handleCallsLoaded = (payload: EventCallsUpdatedType) => {
    dispatch(updateCalls(payload))
  }

  const handleCallChanged = (payload: EventCallUpdatedType) => {
    dispatch(updateCall(payload))
  }

  useEffect(() => {
    socket.on<SocketActionsType>('calls-data-loaded', handleCallsLoaded)
    socket.on<SocketActionsType>('call-data-changed', handleCallChanged)

    return () => {
      socket.off<SocketActionsType>('calls-data-loaded', handleCallsLoaded)
      socket.off<SocketActionsType>('call-data-changed', handleCallChanged)
    }
  }, [dispatch])
}
