import { socket } from 'src/shared/api'

import { useCallSync } from './use-call-sync.model'

export const useCallDataUpdateMonitor = () => {
  const { syncCalls, syncCall } = useCallSync()

  const initializeCallDataUpdateMonitor = () => {
    socket.on('calls-data-loaded', syncCalls)
    socket.on('call-data-changed', syncCall)
  }

  const disposeCallDataUpdateMonitor = () => {
    socket.off('calls-data-loaded', syncCalls)
    socket.off('call-data-changed', syncCall)
  }

  return {
    initializeCallDataUpdateMonitor,
    disposeCallDataUpdateMonitor
  }
}
