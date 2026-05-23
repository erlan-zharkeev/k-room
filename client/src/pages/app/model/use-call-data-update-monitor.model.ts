import type { EventCallsUpdated, EventCallUpdated } from 'global-shared'

import { useSocketEventListeners } from 'src/shared/api'

import { useCall } from './use-call.model'

export const useCallDataUpdateMonitor = () => {
  const { bulkPut, put } = useCall()

  const handleCallsLoaded = async (calls: EventCallsUpdated) => {
    await bulkPut(calls)
  }

  const handleCallChanged = async (call: EventCallUpdated) => {
    await put(call)
  }
  const { initializeSocketEventListeners, disposeSocketEventListeners } = useSocketEventListeners([
    { action: 'calls-data-loaded', handler: handleCallsLoaded },
    { action: 'call-data-changed', handler: handleCallChanged }
  ])

  return {
    initializeCallDataUpdateMonitor: initializeSocketEventListeners,
    disposeCallDataUpdateMonitor: disposeSocketEventListeners
  }
}
