import * as Sentry from '@sentry/vue'
import { isNumber, isUnknownObject } from 'global-shared'

import { router } from '../router'

import {
  CLIENT_FREEZE_CAPTURE_COOLDOWN_MS,
  CLIENT_FREEZE_INPUT_DELAY_MIN_DURATION_MS,
  CLIENT_FREEZE_INPUT_EVENTS,
  CLIENT_FREEZE_LONG_TASK_MIN_DURATION_MS,
  CLIENT_FREEZE_SENTRY_CATEGORY,
  CLIENT_FREEZE_SENTRY_MESSAGE
} from './client-freeze-monitor.constants'

type ClientFreezeKind = 'input-delay' | 'long-task'
type ClientFreezeContext = Record<string, boolean | number | string | null | undefined>

let isClientFreezeMonitorInitialized = false
let longTaskObserver: PerformanceObserver | undefined

const lastCapturedAtByKind: Partial<Record<ClientFreezeKind, number>> = {}

const readNumberProperty = (source: object, key: string) => {
  const value = Reflect.get(source, key)

  return isNumber(value) ? value : undefined
}

const readMemoryContext = (): ClientFreezeContext => {
  const memory = Reflect.get(performance, 'memory')

  if (!isUnknownObject(memory)) return {}

  const jsHeapSizeLimit = readNumberProperty(memory, 'jsHeapSizeLimit')
  const totalJSHeapSize = readNumberProperty(memory, 'totalJSHeapSize')
  const usedJSHeapSize = readNumberProperty(memory, 'usedJSHeapSize')

  return {
    jsHeapSizeLimit,
    totalJSHeapSize,
    usedJSHeapSize
  }
}

const readPageContext = (): ClientFreezeContext => {
  const route = router.currentRoute.value

  return {
    fullPath: route.fullPath,
    routeName: route.name ? String(route.name) : null,
    visibilityState: document.visibilityState,
    isHidden: document.hidden,
    isOnline: navigator.onLine,
    ...readMemoryContext()
  }
}

const readEventTargetContext = (event: Event): ClientFreezeContext => {
  if (!(event.target instanceof Element)) return {}

  const { className, id, tagName } = event.target
  const targetClassName = typeof className === 'string' ? className.slice(0, 160) : ''

  return {
    targetClassName,
    targetId: id || null,
    targetTagName: tagName.toLowerCase()
  }
}

const resolveEventDelayMs = (event: Event) => {
  const isEpochBasedTimestamp = event.timeStamp > performance.timeOrigin / 2
  const currentTime = isEpochBasedTimestamp ? Date.now() : performance.now()

  return currentTime - event.timeStamp
}

const captureClientFreeze = (kind: ClientFreezeKind, context: ClientFreezeContext) => {
  const now = Date.now()
  const lastCapturedAt = lastCapturedAtByKind[kind] ?? 0
  const isCaptureCooldownActive = now - lastCapturedAt < CLIENT_FREEZE_CAPTURE_COOLDOWN_MS
  const data = {
    kind,
    ...readPageContext(),
    ...context
  }

  Sentry.addBreadcrumb({
    category: CLIENT_FREEZE_SENTRY_CATEGORY,
    data,
    level: 'warning',
    message: kind
  })

  if (isCaptureCooldownActive) return

  lastCapturedAtByKind[kind] = now

  Sentry.withScope((scope) => {
    scope.setContext(CLIENT_FREEZE_SENTRY_CATEGORY, data)
    scope.setFingerprint([CLIENT_FREEZE_SENTRY_CATEGORY, kind])
    scope.setLevel('warning')
    scope.setTag('client.freeze.kind', kind)
    Sentry.captureMessage(CLIENT_FREEZE_SENTRY_MESSAGE)
  })
}

const handleInputEvent = (event: Event) => {
  const inputDelayMs = resolveEventDelayMs(event)

  if (inputDelayMs < CLIENT_FREEZE_INPUT_DELAY_MIN_DURATION_MS) return

  captureClientFreeze('input-delay', {
    eventType: event.type,
    inputDelayMs: Math.round(inputDelayMs),
    ...readEventTargetContext(event)
  })
}

const initInputDelayMonitor = () => {
  CLIENT_FREEZE_INPUT_EVENTS.forEach((eventName) => {
    window.addEventListener(eventName, handleInputEvent, {
      capture: true,
      passive: true
    })
  })
}

const initLongTaskMonitor = () => {
  const supportedEntryTypes = window.PerformanceObserver?.supportedEntryTypes

  if (!supportedEntryTypes?.includes('longtask')) return

  longTaskObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach(({ duration, entryType, name, startTime }) => {
      if (duration < CLIENT_FREEZE_LONG_TASK_MIN_DURATION_MS) return

      captureClientFreeze('long-task', {
        durationMs: Math.round(duration),
        entryType,
        taskName: name || null,
        startTimeMs: Math.round(startTime)
      })
    })
  })

  try {
    longTaskObserver.observe({ entryTypes: ['longtask'] })
  } catch {
    longTaskObserver.disconnect()
    longTaskObserver = undefined
  }
}

export const initClientFreezeMonitor = () => {
  if (isClientFreezeMonitorInitialized) return

  isClientFreezeMonitorInitialized = true
  initInputDelayMonitor()
  initLongTaskMonitor()
}
