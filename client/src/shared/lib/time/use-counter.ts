import { useIntervalFn } from '@vueuse/core'
import { onBeforeUnmount, ref } from 'vue'

export const useCounter = (tickMs: number) => {
  const counterValue = ref(0)

  const updateCounterValue = (value: number) => {
    counterValue.value = Math.max(value, 0)
  }

  const { pause: pauseCounter, resume: resumeCounter } = useIntervalFn(
    () => {
      updateCounterValue(counterValue.value - 1)

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

    if (counterValue.value > 0) {
      resumeCounter()
    }
  }

  onBeforeUnmount(stopCounter)

  return {
    counterValue,
    startCounter,
    stopCounter,
    updateCounterValue
  }
}
