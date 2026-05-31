import type { EventCallsUpdated, EventCallUpdated } from 'global-shared'

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
    socket.on('calls-data-loaded', handleCallsLoaded)
    socket.on('call-data-changed', handleCallChanged)
  }

  const disposeCallDataUpdateMonitor = () => {
    socket.off('calls-data-loaded', handleCallsLoaded)
    socket.off('call-data-changed', handleCallChanged)
  }

  return {
    initializeCallDataUpdateMonitor,
    disposeCallDataUpdateMonitor
  }
}
