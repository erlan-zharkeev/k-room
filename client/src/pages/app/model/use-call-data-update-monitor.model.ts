import type { EventCallsUpdated, EventCallUpdated, SocketActions } from 'global-shared'

import { socket } from 'src/shared/api'

import { useCall } from './use-call.model'

export const useCallDataUpdateMonitor = () => {
  const { bulkPut, put } = useCall()

  const handleCallsLoaded = async (calls: EventCallsUpdated) => {
    await bulkPut(calls)
  }

  const handleCallChanged = async (call: EventCallUpdated) => {
    await put(call)
  }

  const initializeCallDataUpdateMonitor = () => {
    socket.on<SocketActions>('calls-data-loaded', handleCallsLoaded)
    socket.on<SocketActions>('call-data-changed', handleCallChanged)
  }

  const disposeCallDataUpdateMonitor = () => {
    socket.off<SocketActions>('calls-data-loaded', handleCallsLoaded)
    socket.off<SocketActions>('call-data-changed', handleCallChanged)
  }

  return {
    initializeCallDataUpdateMonitor,
    disposeCallDataUpdateMonitor
  }
}
