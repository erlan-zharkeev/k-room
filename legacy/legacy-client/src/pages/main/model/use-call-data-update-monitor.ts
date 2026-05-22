import { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { EventCallUpdated, EventCallsUpdated, SocketActions } from 'common'

import { socket } from 'src/shared/api'
import { updateCall, updateCalls } from 'src/shared/call-core'

export const useCallDataUpdateMonitor = () => {
  const dispatch = useDispatch()

  const handleCallsLoaded = (payload: EventCallsUpdated) => {
    dispatch(updateCalls(payload))
  }

  const handleCallChanged = (payload: EventCallUpdated) => {
    dispatch(updateCall(payload))
  }

  useEffect(() => {
    socket.on<SocketActions>('calls-data-loaded', handleCallsLoaded)
    socket.on<SocketActions>('call-data-changed', handleCallChanged)

    return () => {
      socket.off<SocketActions>('calls-data-loaded', handleCallsLoaded)
      socket.off<SocketActions>('call-data-changed', handleCallChanged)
    }
  }, [dispatch])
}
