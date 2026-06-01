import type { EventCallsUpdated, EventCallUpdated } from 'global-shared'

import { useCall } from './use-call.model'

export const useCallSync = () => {
  const { bulkPut, put } = useCall()

  const syncCalls = async (calls: EventCallsUpdated) => {
    await bulkPut(calls)
  }

  const syncCall = async (call: EventCallUpdated) => {
    await put(call)
  }

  return {
    syncCalls,
    syncCall
  }
}
