import type { EventCallsUpdatedType, EventCallUpdatedType, SocketActionsType } from 'global-shared'
import { onBeforeUnmount } from 'vue'

import { socket } from 'src/shared/api'

import { useCall } from './use-call'

export const useCallDataUpdateMonitor = () => {
  const { bulkPut, put } = useCall()

  const handleCallsLoaded = async (calls: EventCallsUpdatedType) => {
    await bulkPut(calls)
  }

  const handleCallChanged = async (call: EventCallUpdatedType) => {
    await put(call)
  }

  const initializeCallDataUpdateMonitor = () => {
    socket.on<SocketActionsType>('calls-data-loaded', handleCallsLoaded)
    socket.on<SocketActionsType>('call-data-changed', handleCallChanged)
  }

  const disposeCallDataUpdateMonitor = () => {
    socket.off<SocketActionsType>('calls-data-loaded', handleCallsLoaded)
    socket.off<SocketActionsType>('call-data-changed', handleCallChanged)
  }

  onBeforeUnmount(disposeCallDataUpdateMonitor)

  return {
    initializeCallDataUpdateMonitor,
    disposeCallDataUpdateMonitor
  }
}
