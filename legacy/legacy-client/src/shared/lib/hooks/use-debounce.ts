import { useCallback, useRef } from 'react'

export const useDebounce = <T>(fn: (payload: T) => void, timeout: number) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return useCallback(
    (payload: T) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        fn(payload)
      }, timeout)
    },
    [fn, timeout]
  )
}
