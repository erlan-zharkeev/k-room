import { useEffect, useState } from 'react'

import { useTimeout } from './use-timeout'

export const useIntervalRerender = (delay: number) => {
  const [, setTick] = useState(0)
  const { startInterval, stopInterval } = useTimeout()

  useEffect(() => {
    startInterval(() => {
      setTick((value) => value + 1)
    }, delay)

    return () => {
      stopInterval()
    }
  }, [delay])
}
