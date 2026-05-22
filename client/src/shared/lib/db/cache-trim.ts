import { isUnknownObject } from 'global-shared'

import { loadStorageEstimate } from '../storage/storage'

import { DEXIE_CACHE_TRIM_EVENT_COOLDOWN_MS, DEXIE_QUOTA_ERROR_NAME_SET } from './constants'
import type { DexieCacheTrimEvent, DexieCacheTrimEventType, DexieCacheTrimmer, DexieErrorLike } from './types'

const cacheTrimmerById = new Map<string, DexieCacheTrimmer>()
const cacheTrimEventListeners = new Set<(event: DexieCacheTrimEvent) => void>()
const lastCacheTrimEventTimeByType: Partial<Record<DexieCacheTrimEventType, number>> = {}

let trimPromise: Promise<boolean> | undefined
let isTrimmingCache = false

const readErrorData = (error: unknown): DexieErrorLike | undefined => {
  if (!isUnknownObject(error)) return

  return error
}

const emitCacheTrimEvent = (event: DexieCacheTrimEvent) => {
  const now = Date.now()
  const lastEventTime = lastCacheTrimEventTimeByType[event.type] ?? 0

  if (now - lastEventTime < DEXIE_CACHE_TRIM_EVENT_COOLDOWN_MS) return

  lastCacheTrimEventTimeByType[event.type] = now
  cacheTrimEventListeners.forEach((listener) => listener(event))
}

const trimDexieCache = async () => {
  const trimmers = [...cacheTrimmerById.values()].sort((first, second) => first.priority - second.priority)

  isTrimmingCache = true

  try {
    for (const trimmer of trimmers) {
      const result = await trimmer.trim()

      if (result.trimmed) {
        await loadStorageEstimate()

        return true
      }
    }

    await loadStorageEstimate()

    return false
  } finally {
    isTrimmingCache = false
  }
}

const requestDexieCacheTrim = () => {
  if (!trimPromise) {
    trimPromise = trimDexieCache().finally(() => {
      trimPromise = undefined
    })
  }

  return trimPromise
}

export const isDexieQuotaError = (error: unknown): boolean => {
  const data = readErrorData(error)

  if (!data) return false

  const errorName = data.name
  const errorFailures = data.failures
  const isErrorNameString = typeof errorName === 'string'
  const isKnownQuotaErrorName = isErrorNameString && DEXIE_QUOTA_ERROR_NAME_SET.has(errorName)
  const hasQuotaErrorInner = isDexieQuotaError(data.inner)
  const hasErrorFailures = Array.isArray(errorFailures)
  const hasQuotaErrorFailure = hasErrorFailures && errorFailures.some(isDexieQuotaError)

  if (isKnownQuotaErrorName) {
    return true
  }

  if (hasQuotaErrorInner) {
    return true
  }

  if (hasQuotaErrorFailure) {
    return true
  }

  return false
}

export const registerDexieCacheTrimmer = (trimmer: DexieCacheTrimmer) => {
  cacheTrimmerById.set(trimmer.id, trimmer)
}

export const subscribeDexieCacheTrimEvents = (listener: (event: DexieCacheTrimEvent) => void) => {
  cacheTrimEventListeners.add(listener)

  return () => {
    cacheTrimEventListeners.delete(listener)
  }
}

export const runDexieCacheTrimGuard = async <T>(operation: () => Promise<T>) => {
  try {
    return await operation()
  } catch (error) {
    if (!isDexieQuotaError(error) || isTrimmingCache) {
      throw error
    }

    let isTrimmed = false

    try {
      isTrimmed = await requestDexieCacheTrim()
    } catch {
      emitCacheTrimEvent({ type: 'cache-trim-failed' })
      throw error
    }

    if (!isTrimmed) {
      emitCacheTrimEvent({ type: 'cache-trim-failed' })
      throw error
    }

    try {
      const result = await operation()

      emitCacheTrimEvent({ type: 'cache-trimmed' })

      return result
    } catch (retryError) {
      if (isDexieQuotaError(retryError)) {
        emitCacheTrimEvent({ type: 'cache-trim-failed' })
      }

      throw retryError
    }
  }
}
