import { useEffect, useRef, useState } from 'react'

import { IAnimatedListItem } from './config'

export const useAnimatedList = <T extends object>(
  items: T[],
  keyField: keyof T,
  {
    enterDuration = 360,
    exitDuration = 280
  }: {
    enterDuration?: number
    exitDuration?: number
  } = {}
) => {
  const [renderedItems, setRenderedItems] = useState<Array<IAnimatedListItem<T>>>([])
  const initializedRef = useRef(false)
  const enterTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const exitTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    setRenderedItems((prev) => {
      const prevMap = new Map(prev.map((entry) => [entry.key, entry]))
      const nextKeys = new Set(items.map((item) => String(item[keyField])))
      const nextEntries = items.map((item) => {
        const key = String(item[keyField])
        const prevEntry = prevMap.get(key)

        if (prevEntry) {
          return {
            ...prevEntry,
            item,
            state: prevEntry.state === 'exiting' ? 'present' : prevEntry.state
          }
        }

        return {
          item,
          key,
          state: initializedRef.current ? 'entering' : 'present'
        } satisfies IAnimatedListItem<T>
      })

      const exitingEntries = prev
        .filter((entry) => !nextKeys.has(entry.key))
        .map((entry) => ({ ...entry, state: 'exiting' as const }))

      const mergedEntries = [...nextEntries, ...exitingEntries]
      const isSame =
        prev.length === mergedEntries.length &&
        prev.every((entry, index) => {
          const nextEntry = mergedEntries[index]

          return (
            nextEntry !== undefined &&
            entry.key === nextEntry.key &&
            entry.state === nextEntry.state &&
            entry.item === nextEntry.item
          )
        })

      return isSame ? prev : mergedEntries
    })

    initializedRef.current = true
  }, [items, keyField])

  useEffect(() => {
    renderedItems.forEach((entry) => {
      if (entry.state === 'entering' && !enterTimersRef.current.has(entry.key)) {
        const timerId = setTimeout(() => {
          setRenderedItems((prev) =>
            prev.map((item) => (item.key === entry.key ? { ...item, state: 'present' as const } : item))
          )
          enterTimersRef.current.delete(entry.key)
        }, enterDuration)

        enterTimersRef.current.set(entry.key, timerId)
      }

      if (entry.state === 'exiting' && !exitTimersRef.current.has(entry.key)) {
        const timerId = setTimeout(() => {
          setRenderedItems((prev) => prev.filter((item) => item.key !== entry.key))
          exitTimersRef.current.delete(entry.key)
        }, exitDuration)

        exitTimersRef.current.set(entry.key, timerId)
      }
    })
  }, [enterDuration, exitDuration, renderedItems])

  useEffect(() => {
    const enterTimers = enterTimersRef.current
    const exitTimers = exitTimersRef.current

    return () => {
      enterTimers.forEach((timerId) => clearTimeout(timerId))
      exitTimers.forEach((timerId) => clearTimeout(timerId))
    }
  }, [])

  return { renderedItems }
}
