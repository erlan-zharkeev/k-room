import * as Sentry from '@sentry/vue'
import { isNumber, isString, isUnknownObject } from 'global-shared'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { router } from '../router'

import {
  CLIENT_FREEZE_CAPTURE_COOLDOWN_MS,
  CLIENT_FREEZE_CONTEXT_STRING_MAX_LENGTH,
  CLIENT_FREEZE_DIAGNOSTIC_TRAIL_LIMIT,
  CLIENT_FREEZE_INPUT_DELAY_MIN_DURATION_MS,
  CLIENT_FREEZE_INPUT_EVENTS,
  CLIENT_FREEZE_LONG_TASK_ATTRIBUTION_LIMIT,
  CLIENT_FREEZE_LONG_TASK_MIN_DURATION_MS,
  CLIENT_FREEZE_RECENT_ACTIVITY_WINDOW_MS,
  CLIENT_FREEZE_RECENT_RESOURCE_LIMIT,
  CLIENT_FREEZE_SENTRY_CATEGORY,
  CLIENT_FREEZE_SENTRY_MESSAGE
} from './client-freeze-monitor.constants'

type ClientFreezeKind = 'input-delay' | 'long-task'
type ClientFreezeContext = Record<string, unknown>
type ClientFreezeDiagnosticEvent = ClientFreezeContext & {
  atMs: number
  fullPath: string
  kind: string
}
type ClientFreezeRouteTransition = {
  finishedAtMs?: number
  fromFullPath: string
  fromName: string | null
  startedAtMs: number
  toFullPath: string
  toName: string | null
}

let isClientFreezeMonitorInitialized = false
let longTaskObserver: PerformanceObserver | undefined
let pageHiddenAtMs = document.hidden ? 0 : null
let activeRouteTransition: ClientFreezeRouteTransition | null = null
let lastInputDiagnosticEvent: ClientFreezeDiagnosticEvent | null = null
let lastRouteTransition: ClientFreezeRouteTransition | null = null

const lastCapturedAtByKind: Partial<Record<ClientFreezeKind, number>> = {}
const diagnosticTrail: ClientFreezeDiagnosticEvent[] = []

const truncateContextString = (value: string) => value.slice(0, CLIENT_FREEZE_CONTEXT_STRING_MAX_LENGTH)

const readNumberProperty = (source: object, key: string) => {
  const value = Reflect.get(source, key)

  return isNumber(value) ? value : undefined
}

const readStringProperty = (source: object, key: string) => {
  const value = Reflect.get(source, key)

  return isString(value) ? truncateContextString(value) : undefined
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

const readBrowserRuntimeContext = (): ClientFreezeContext => {
  const connection = Reflect.get(navigator, 'connection')
  const deviceMemory = Reflect.get(navigator, 'deviceMemory')

  return {
    connectionDownlinkMbps: isUnknownObject(connection) ? readNumberProperty(connection, 'downlink') : undefined,
    connectionEffectiveType: isUnknownObject(connection) ? readStringProperty(connection, 'effectiveType') : undefined,
    connectionRttMs: isUnknownObject(connection) ? readNumberProperty(connection, 'rtt') : undefined,
    connectionSaveData: isUnknownObject(connection) ? Boolean(Reflect.get(connection, 'saveData')) : undefined,
    deviceMemoryGb: isNumber(deviceMemory) ? deviceMemory : undefined,
    devicePixelRatio: window.devicePixelRatio,
    hardwareConcurrency: navigator.hardwareConcurrency,
    isAndroidUserAgent: /Android/i.test(navigator.userAgent),
    viewportHeight: window.innerHeight,
    viewportWidth: window.innerWidth
  }
}

const readRouteContext = (route: RouteLocationNormalizedLoaded): ClientFreezeContext => ({
  fullPath: route.fullPath,
  routeName: route.name ? String(route.name) : null
})

const readPageContext = (): ClientFreezeContext => {
  const route = router.currentRoute.value

  return {
    ...readRouteContext(route),
    visibilityState: document.visibilityState,
    isHidden: document.hidden,
    isOnline: navigator.onLine,
    ...readBrowserRuntimeContext(),
    ...readMemoryContext()
  }
}

const readEventTargetContext = (event: Event): ClientFreezeContext => {
  if (!(event.target instanceof Element)) return {}

  const { className, id, tagName } = event.target
  const targetClassName = isString(className) ? truncateContextString(className) : ''

  return {
    targetClassName,
    targetId: id ? truncateContextString(id) : null,
    targetTagName: tagName.toLowerCase()
  }
}

const readNavigationFailureType = (failure: unknown) => {
  if (!isUnknownObject(failure)) return null

  const type = Reflect.get(failure, 'type')

  if (isNumber(type) || isString(type)) return String(type)

  return 'unknown'
}

const readLongTaskAttribution = (entry: PerformanceEntry) => {
  const attribution = Reflect.get(entry, 'attribution')

  if (!Array.isArray(attribution)) return []

  return attribution.slice(0, CLIENT_FREEZE_LONG_TASK_ATTRIBUTION_LIMIT).map((item) => {
    if (!isUnknownObject(item)) return {}

    return {
      containerId: readStringProperty(item, 'containerId') ?? null,
      containerName: readStringProperty(item, 'containerName') ?? null,
      containerSrc: readStringProperty(item, 'containerSrc') ?? null,
      containerType: readStringProperty(item, 'containerType') ?? null,
      durationMs: Math.round(readNumberProperty(item, 'duration') ?? 0),
      entryType: readStringProperty(item, 'entryType') ?? null,
      name: readStringProperty(item, 'name') ?? null,
      startTimeMs: Math.round(readNumberProperty(item, 'startTime') ?? 0)
    }
  })
}

const readResourceUrl = (value: string) => {
  try {
    const url = new URL(value)

    return truncateContextString(`${url.origin}${url.pathname}`)
  } catch {
    return truncateContextString(value)
  }
}

const readRecentResourceTimings = (startTimeMs: number, durationMs: number) => {
  const minStartTimeMs = startTimeMs - CLIENT_FREEZE_RECENT_ACTIVITY_WINDOW_MS
  const maxStartTimeMs = startTimeMs + durationMs

  return performance
    .getEntriesByType('resource')
    .filter(({ startTime }) => startTime >= minStartTimeMs && startTime <= maxStartTimeMs)
    .slice(-CLIENT_FREEZE_RECENT_RESOURCE_LIMIT)
    .map((entry) => ({
      decodedBodySize: Math.round(Reflect.get(entry, 'decodedBodySize') ?? 0),
      durationMs: Math.round(entry.duration),
      encodedBodySize: Math.round(Reflect.get(entry, 'encodedBodySize') ?? 0),
      initiatorType: readStringProperty(entry, 'initiatorType') ?? null,
      name: readResourceUrl(entry.name),
      responseEndMs: Math.round(Reflect.get(entry, 'responseEnd') ?? 0),
      startTimeMs: Math.round(entry.startTime),
      transferSize: Math.round(Reflect.get(entry, 'transferSize') ?? 0)
    }))
}

const resolveEventDelayMs = (event: Event) => {
  const isEpochBasedTimestamp = event.timeStamp > performance.timeOrigin / 2
  const currentTime = isEpochBasedTimestamp ? Date.now() : performance.now()

  return currentTime - event.timeStamp
}

const syncPageHiddenAt = () => {
  pageHiddenAtMs = document.hidden ? performance.now() : null
}

const isLongTaskStartedWhileHidden = (startTimeMs: number) => pageHiddenAtMs !== null && startTimeMs >= pageHiddenAtMs

const recordDiagnosticEvent = (kind: string, context: ClientFreezeContext = {}): ClientFreezeDiagnosticEvent => {
  const event = {
    atMs: Math.round(performance.now()),
    fullPath: router.currentRoute.value.fullPath,
    isHidden: document.hidden,
    kind,
    ...context
  }

  diagnosticTrail.push(event)

  if (diagnosticTrail.length > CLIENT_FREEZE_DIAGNOSTIC_TRAIL_LIMIT) {
    diagnosticTrail.shift()
  }

  return event
}

const readDiagnosticTrail = () => {
  const now = performance.now()

  return diagnosticTrail.map(({ atMs, ...event }) => ({
    ageMs: Math.round(now - atMs),
    atMs,
    ...event
  }))
}

const readRouteTransitionContext = (transition: ClientFreezeRouteTransition | null) => {
  if (!transition) return null

  const finishedAtMs = transition.finishedAtMs ?? performance.now()

  return {
    durationMs: Math.round(finishedAtMs - transition.startedAtMs),
    finishedAtMs: transition.finishedAtMs ? Math.round(transition.finishedAtMs) : null,
    fromFullPath: transition.fromFullPath,
    fromName: transition.fromName,
    startedAtMs: Math.round(transition.startedAtMs),
    toFullPath: transition.toFullPath,
    toName: transition.toName
  }
}

const resolveRecentInputEvent = (startTimeMs: number) => {
  if (!lastInputDiagnosticEvent) return null

  const inputAgeMs = startTimeMs - lastInputDiagnosticEvent.atMs

  if (inputAgeMs < 0 || inputAgeMs > CLIENT_FREEZE_RECENT_ACTIVITY_WINDOW_MS) return null

  return {
    ...lastInputDiagnosticEvent,
    ageAtFreezeStartMs: Math.round(inputAgeMs)
  }
}

const resolveProbableCause = (startTimeMs: number) => {
  if (activeRouteTransition && startTimeMs >= activeRouteTransition.startedAtMs) return 'route-transition'

  const recentInputEvent = resolveRecentInputEvent(startTimeMs)

  if (recentInputEvent) {
    const eventType = Reflect.get(recentInputEvent, 'eventType')

    return `input:${isString(eventType) ? eventType : 'unknown'}`
  }

  if (lastRouteTransition?.finishedAtMs) {
    const routeTransitionAgeMs = startTimeMs - lastRouteTransition.finishedAtMs

    if (routeTransitionAgeMs >= 0 && routeTransitionAgeMs <= CLIENT_FREEZE_RECENT_ACTIVITY_WINDOW_MS) {
      return 'post-route-transition'
    }
  }

  return 'main-thread-work'
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
  const probableCause = Reflect.get(data, 'probableCause')

  Sentry.withScope((scope) => {
    scope.setContext(CLIENT_FREEZE_SENTRY_CATEGORY, data)
    scope.setContext(`${CLIENT_FREEZE_SENTRY_CATEGORY}.trail`, {
      events: readDiagnosticTrail()
    })
    scope.setFingerprint([CLIENT_FREEZE_SENTRY_CATEGORY, kind])
    scope.setLevel('warning')
    scope.setTag('client.freeze.kind', kind)
    if (isString(probableCause)) scope.setTag('client.freeze.probable_cause', probableCause)
    Sentry.captureMessage(CLIENT_FREEZE_SENTRY_MESSAGE)
  })
}

const handleInputEvent = (event: Event) => {
  const eventContext = {
    eventType: event.type,
    ...readEventTargetContext(event)
  }
  lastInputDiagnosticEvent = recordDiagnosticEvent('input', eventContext)
  const inputDelayMs = resolveEventDelayMs(event)

  if (inputDelayMs < CLIENT_FREEZE_INPUT_DELAY_MIN_DURATION_MS) return

  captureClientFreeze('input-delay', {
    ...eventContext,
    inputDelayMs: Math.round(inputDelayMs),
    probableCause: `input:${event.type}`
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
    list.getEntries().forEach((entry) => {
      const { duration, entryType, name, startTime } = entry

      if (duration < CLIENT_FREEZE_LONG_TASK_MIN_DURATION_MS) return
      if (isLongTaskStartedWhileHidden(startTime)) {
        recordDiagnosticEvent('hidden-long-task', {
          durationMs: Math.round(duration),
          startTimeMs: Math.round(startTime)
        })
        return
      }

      const attribution = readLongTaskAttribution(entry)
      const recentResources = readRecentResourceTimings(startTime, duration)

      captureClientFreeze('long-task', {
        activeRouteTransition: readRouteTransitionContext(activeRouteTransition),
        diagnosticTrail: readDiagnosticTrail(),
        durationMs: Math.round(duration),
        endTimeMs: Math.round(startTime + duration),
        entryType,
        lastInputEvent: resolveRecentInputEvent(startTime),
        lastRouteTransition: readRouteTransitionContext(lastRouteTransition),
        probableCause: resolveProbableCause(startTime),
        recentResources: recentResources.length ? recentResources : null,
        taskAttribution: attribution.length ? attribution : null,
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

const initRouteDiagnostics = () => {
  router.beforeEach((to, from) => {
    activeRouteTransition = {
      fromFullPath: from.fullPath,
      fromName: from.name ? String(from.name) : null,
      startedAtMs: performance.now(),
      toFullPath: to.fullPath,
      toName: to.name ? String(to.name) : null
    }

    recordDiagnosticEvent('route-start', {
      fromFullPath: from.fullPath,
      toFullPath: to.fullPath
    })
  })

  router.afterEach((to, from, failure) => {
    const finishedAtMs = performance.now()
    const routeTransition = activeRouteTransition ?? {
      fromFullPath: from.fullPath,
      fromName: from.name ? String(from.name) : null,
      startedAtMs: finishedAtMs,
      toFullPath: to.fullPath,
      toName: to.name ? String(to.name) : null
    }

    lastRouteTransition = {
      ...routeTransition,
      finishedAtMs
    }
    activeRouteTransition = null

    recordDiagnosticEvent('route-end', {
      durationMs: Math.round(finishedAtMs - routeTransition.startedAtMs),
      failureType: readNavigationFailureType(failure),
      fromFullPath: from.fullPath,
      toFullPath: to.fullPath
    })
  })

  router.onError((error, to, from) => {
    activeRouteTransition = null

    recordDiagnosticEvent('route-error', {
      errorMessage: error.message,
      fromFullPath: from.fullPath,
      toFullPath: to.fullPath
    })
  })
}

const initVisibilityDiagnostics = () => {
  document.addEventListener('visibilitychange', () => {
    syncPageHiddenAt()
    recordDiagnosticEvent('visibility', {
      visibilityState: document.visibilityState
    })
  })
}

export const initClientFreezeMonitor = () => {
  if (isClientFreezeMonitorInitialized) return

  isClientFreezeMonitorInitialized = true
  initRouteDiagnostics()
  initVisibilityDiagnostics()
  initInputDelayMonitor()
  initLongTaskMonitor()
}
