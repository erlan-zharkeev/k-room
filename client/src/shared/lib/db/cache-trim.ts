import { isString, isUnknownObject } from 'global-shared'

import { loadStorageEstimate } from '../storage/storage.model'

import {
  DEXIE_CACHE_TRIM_EVENT_COOLDOWN_MS,
  DEXIE_QUOTA_ERROR_NAME_SET,
  DEXIE_SAFARI_STORAGE_ERROR_MESSAGES,
  DEXIE_SAFARI_STORAGE_ERROR_NAME_SET
} from './constants'
import type { DexieCacheTrimEvent, DexieCacheTrimEventKind, DexieCacheTrimmer, DexieErrorLike } from './types'

const cacheTrimmerById = new Map<string, DexieCacheTrimmer>()
const cacheTrimEventListeners = new Set<(event: DexieCacheTrimEvent) => void>()
const lastCacheTrimEventTimeByKind: Partial<Record<DexieCacheTrimEventKind, number>> = {}

let trimPromise: Promise<boolean> | undefined
let isTrimmingCache = false

const readErrorData = (error: unknown): DexieErrorLike | undefined => {
  if (!isUnknownObject(error)) return

  return error
}

const emitCacheTrimEvent = (event: DexieCacheTrimEvent) => {
  const now = Date.now()
  const lastEventTime = lastCacheTrimEventTimeByKind[event.type] ?? 0

  if (now - lastEventTime < DEXIE_CACHE_TRIM_EVENT_COOLDOWN_MS) return

  lastCacheTrimEventTimeByKind[event.type] = now
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

const isSafariStorageWriteError = (data: DexieErrorLike) => {
  const { message, name } = data
  const isKnownSafariStorageErrorName = isString(name) && DEXIE_SAFARI_STORAGE_ERROR_NAME_SET.has(name)
  const hasKnownSafariStorageErrorMessage =
    isString(message) && DEXIE_SAFARI_STORAGE_ERROR_MESSAGES.some((errorMessage) => message.includes(errorMessage))
  const hasKnownSafariStorageNestedError =
    isString(message) &&
    DEXIE_SAFARI_STORAGE_ERROR_MESSAGES.some((errorMessage) => message.includes(`UnknownError: ${errorMessage}`))

  return hasKnownSafariStorageErrorMessage && (isKnownSafariStorageErrorName || hasKnownSafariStorageNestedError)
}

const isDexieTransientTransactionError = (error: unknown): boolean => {
  const data = readErrorData(error)

  if (!data) return false

  const { failures, inner, message } = data
  const hasTransientTransactionMessage =
    isString(message) && message.includes('Attempt to delete range from database without an in-progress transaction')
  const hasTransientInnerError = isDexieTransientTransactionError(inner)
  const hasTransientFailure = Array.isArray(failures) && failures.some(isDexieTransientTransactionError)

  return hasTransientTransactionMessage || hasTransientInnerError || hasTransientFailure
}

export const isDexieQuotaError = (error: unknown): boolean => {
  const data = readErrorData(error)

  if (!data) return false

  const { name: errorName, failures: errorFailures } = data
  const isErrorNameString = isString(errorName)
  const isKnownQuotaErrorName = isErrorNameString && DEXIE_QUOTA_ERROR_NAME_SET.has(errorName)
  const isKnownSafariStorageWriteError = isSafariStorageWriteError(data)
  const hasQuotaErrorInner = isDexieQuotaError(data.inner)
  const hasErrorFailures = Array.isArray(errorFailures)
  const hasQuotaErrorFailure = hasErrorFailures && errorFailures.some(isDexieQuotaError)

  if (isKnownQuotaErrorName || isKnownSafariStorageWriteError) {
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
    if (isDexieTransientTransactionError(error)) {
      return operation()
    }

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
