import { MEDIA_SYNC_CONCURRENCY } from '../config/constants'

import type { MediaQueuedSyncTask, MediaSyncTask } from './types'

const inFlight = new Map<string, Promise<void>>()
const pending: MediaQueuedSyncTask[] = []
let activeCount = 0
let isBlocked = false

const runNext = () => {
  if (isBlocked) return
  if (activeCount >= MEDIA_SYNC_CONCURRENCY) return

  const task = pending.shift()

  if (!task) return

  void task.run()
}

const runQueued = (task: MediaSyncTask) => {
  return new Promise<void>((resolve, reject) => {
    const run = async () => {
      if (isBlocked) {
        resolve()

        return
      }

      activeCount += 1

      try {
        await task()
        resolve()
      } catch (error) {
        reject(error)
      } finally {
        activeCount -= 1
        runNext()
      }
    }

    if (isBlocked) {
      resolve()

      return
    }

    if (activeCount < MEDIA_SYNC_CONCURRENCY) {
      void run()

      return
    }

    pending.push({ run, resolve })
  })
}

export const blockMediaSyncQueue = () => {
  isBlocked = true
  pending.splice(0).forEach(({ resolve }) => resolve())
}

export const allowMediaSyncQueue = () => {
  isBlocked = false
}

export const enqueueMediaSync = async (mediaId: string, task: MediaSyncTask) => {
  if (isBlocked) return

  const current = inFlight.get(mediaId)

  if (current) {
    await current

    return
  }

  const request = runQueued(task)

  inFlight.set(mediaId, request)

  try {
    await request
  } finally {
    inFlight.delete(mediaId)
  }
}
