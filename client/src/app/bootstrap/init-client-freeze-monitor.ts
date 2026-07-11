import * as Sentry from '@sentry/vue'
import { isString } from 'global-shared'

import { readClientUiTaskDiagnostics } from 'src/shared/model'

import { router } from '../router'

import {
  CLIENT_FREEZE_CAPTURE_COOLDOWN_MS,
  CLIENT_FREEZE_DIAGNOSTIC_TRAIL_LIMIT,
  CLIENT_FREEZE_INPUT_DELAY_MIN_DURATION_MS,
  CLIENT_FREEZE_INPUT_EVENTS,
  CLIENT_FREEZE_LONG_TASK_MIN_DURATION_MS,
  CLIENT_FREEZE_RECENT_ACTIVITY_WINDOW_MS,
  CLIENT_FREEZE_SENTRY_CATEGORY,
  CLIENT_FREEZE_SENTRY_MESSAGE
} from './client-freeze-monitor/constants'
import {
  readEventTargetContext,
  readLongTaskAttribution,
  readNavigationFailureType,
  readPageContext,
  readRecentResourceTimings,
  resolveEventDelayMs
} from './client-freeze-monitor/context'
import type {
  ClientFreezeContext,
  ClientFreezeDiagnosticEvent,
  ClientFreezeKind,
  ClientFreezeRouteTransition
} from './client-freeze-monitor/types'

let isClientFreezeMonitorInitialized = false
let longTaskObserver: PerformanceObserver | undefined
let pageHiddenAtMs = document.hidden ? 0 : null
let activeRouteTransition: ClientFreezeRouteTransition | null = null
let lastInputDiagnosticEvent: ClientFreezeDiagnosticEvent | null = null
let lastRouteTransition: ClientFreezeRouteTransition | null = null

const lastCapturedAtByKind: Partial<Record<ClientFreezeKind, number>> = {}
const diagnosticTrail: ClientFreezeDiagnosticEvent[] = []

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

const resolveProbableCause = (startTimeMs: number, probableClientUiTaskName?: string) => {
  if (probableClientUiTaskName) return `ui-task:${probableClientUiTaskName}`

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
  const probableClientUiTask = Reflect.get(data, 'probableClientUiTask')

  Sentry.withScope((scope) => {
    scope.setContext(CLIENT_FREEZE_SENTRY_CATEGORY, data)
    scope.setContext(`${CLIENT_FREEZE_SENTRY_CATEGORY}.trail`, {
      events: readDiagnosticTrail()
    })
    scope.setFingerprint([CLIENT_FREEZE_SENTRY_CATEGORY, kind])
    scope.setLevel('warning')
    scope.setTag('client.freeze.kind', kind)
    if (isString(probableCause)) scope.setTag('client.freeze.probable_cause', probableCause)
    if (isString(probableClientUiTask)) scope.setTag('client.freeze.ui_task', probableClientUiTask)
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
      const endTimeMs = startTime + duration
      const uiTasks = readClientUiTaskDiagnostics(startTime, endTimeMs, CLIENT_FREEZE_RECENT_ACTIVITY_WINDOW_MS)
      const probableClientUiTaskName = uiTasks.probableTask?.name

      captureClientFreeze('long-task', {
        activeRouteTransition: readRouteTransitionContext(activeRouteTransition),
        diagnosticTrail: readDiagnosticTrail(),
        durationMs: Math.round(duration),
        endTimeMs: Math.round(endTimeMs),
        entryType,
        lastInputEvent: resolveRecentInputEvent(startTime),
        lastRouteTransition: readRouteTransitionContext(lastRouteTransition),
        probableClientUiTask: probableClientUiTaskName ?? null,
        probableCause: resolveProbableCause(startTime, probableClientUiTaskName),
        recentResources: recentResources.length ? recentResources : null,
        taskAttribution: attribution.length ? attribution : null,
        taskName: name || null,
        uiTasks,
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
