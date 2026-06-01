import type { Call, EventCallsUpdated } from 'global-shared'

import { useCall } from './use-call.model'

export const useCallSync = () => {
  const { bulkPut, put } = useCall()

  const syncCalls = async (calls: EventCallsUpdated) => {
    await bulkPut(calls)
  }

  const syncCall = async (call: Call) => {
    await put(call)
  }

  return {
    syncCalls,
    syncCall
  }
}
