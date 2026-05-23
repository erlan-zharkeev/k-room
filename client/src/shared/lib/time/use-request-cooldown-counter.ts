import { getNextRequestIntervalSec } from './time'
import { useCounter } from './use-counter'

const resolveCounterValue = (nextRequestTimestampMs: number) =>
  Math.max(0, Math.round(getNextRequestIntervalSec(nextRequestTimestampMs)))

export const useRequestCooldownCounter = (tickMs: number) => {
  const { counterValue, startCounter, stopCounter, updateCounterValue } = useCounter(tickMs)

  const syncCounterValue = (nextRequestTimestampMs: number) => {
    updateCounterValue(resolveCounterValue(nextRequestTimestampMs))
    startCounter()
  }

  return {
    counterValue,
    startCounter,
    stopCounter,
    syncCounterValue
  }
}
