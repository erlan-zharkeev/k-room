import { useCallback, useEffect, useRef } from 'react'

export const useTimeout = () => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimeout = useCallback((callback: () => void, delay: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(callback, delay)
  }, [])

  const startInterval = useCallback((callback: () => void, delay: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(callback, delay)
  }, [])

  const stopInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  const delay = useCallback(async (ms: number): Promise<void> => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    return new Promise((resolve) => {
      timeoutRef.current = setTimeout(() => {
        resolve()
      }, ms)
    })
  }, [])

  const appNextTick = async (): Promise<void> => {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve()
        })
      })
    })
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return { startTimeout, startInterval, stopInterval, delay, appNextTick }
}
