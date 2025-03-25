import { useCallback, useRef } from 'react'

export const useDebounce = (fn: (payload: unknown) => void, timeout: number) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return useCallback(
    (payload: unknown) => {
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
