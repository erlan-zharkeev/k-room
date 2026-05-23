import { useIntervalFn } from '@vueuse/core'
import { onBeforeUnmount, ref } from 'vue'

import { getNextRequestIntervalSec } from './time'

const resolveCounterValue = (nextRequestTimestampMs: number) =>
  Math.max(0, Math.round(getNextRequestIntervalSec(nextRequestTimestampMs)))

export const useRequestCooldownCounter = (tickMs: number) => {
  const counterValue = ref(0)
  const { pause: pauseCounter, resume: resumeCounter } = useIntervalFn(
    () => {
      counterValue.value = Math.max(counterValue.value - 1, 0)

      if (counterValue.value <= 0) {
        pauseCounter()
      }
    },
    tickMs,
    { immediate: false, immediateCallback: false }
  )

  const stopCounter = () => pauseCounter()

  const startCounter = () => {
    stopCounter()
    resumeCounter()
  }

  const syncCounterValue = (nextRequestTimestampMs: number) => {
    counterValue.value = resolveCounterValue(nextRequestTimestampMs)
    startCounter()
  }

  onBeforeUnmount(stopCounter)

  return {
    counterValue,
    startCounter,
    stopCounter,
    syncCounterValue
  }
}
