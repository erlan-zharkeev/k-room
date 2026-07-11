import { isNumber, isString, isUnknownObject } from 'global-shared'

import { router } from '../../router'

import {
  CLIENT_FREEZE_CONTEXT_STRING_MAX_LENGTH,
  CLIENT_FREEZE_LONG_TASK_ATTRIBUTION_LIMIT,
  CLIENT_FREEZE_RECENT_ACTIVITY_WINDOW_MS,
  CLIENT_FREEZE_RECENT_RESOURCE_LIMIT
} from './constants'
import type { ClientFreezeContext } from './types'

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

const readRouteContext = (route: typeof router.currentRoute.value): ClientFreezeContext => ({
  fullPath: route.fullPath,
  routeName: route.name ? String(route.name) : null
})

export const readPageContext = (): ClientFreezeContext => {
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

export const readEventTargetContext = (event: Event): ClientFreezeContext => {
  if (!(event.target instanceof Element)) return {}

  const { className, id, tagName } = event.target
  const targetClassName = isString(className) ? truncateContextString(className) : ''

  return {
    targetClassName,
    targetId: id ? truncateContextString(id) : null,
    targetTagName: tagName.toLowerCase()
  }
}

export const readNavigationFailureType = (failure: unknown) => {
  if (!isUnknownObject(failure)) return null

  const type = Reflect.get(failure, 'type')

  if (isNumber(type) || isString(type)) return String(type)

  return 'unknown'
}

export const readLongTaskAttribution = (entry: PerformanceEntry) => {
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

export const readRecentResourceTimings = (startTimeMs: number, durationMs: number) => {
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

export const resolveEventDelayMs = (event: Event) => {
  const isEpochBasedTimestamp = event.timeStamp > performance.timeOrigin / 2
  const currentTime = isEpochBasedTimestamp ? Date.now() : performance.now()

  return currentTime - event.timeStamp
}
