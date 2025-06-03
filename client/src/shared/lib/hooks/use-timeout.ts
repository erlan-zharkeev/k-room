import { useCallback, useEffect, useRef } from 'react'

export const useTimeout = () => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startTimeout = useCallback((callback: () => void, delay: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(callback, delay)
  }, [])

  const delay = useCallback(async (ms: number): Promise<void> => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    // eslint-disable-next-line no-return-await
    return await new Promise((resolve) => {
      timeoutRef.current = setTimeout(() => {
        resolve()
      }, ms)
    })
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return { startTimeout, delay }
}
