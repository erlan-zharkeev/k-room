import { MEDIA_SYNC_CONCURRENCY } from '../config/constants'

import type { MediaQueueTaskType, MediaSyncTaskType } from './types'

const inFlight = new Map<string, Promise<void>>()
const pending: MediaQueueTaskType[] = []
let activeCount = 0

const runNext = () => {
  if (activeCount >= MEDIA_SYNC_CONCURRENCY) return

  const task = pending.shift()

  if (!task) return

  void task()
}

const runQueued = (task: MediaSyncTaskType) => {
  return new Promise<void>((resolve, reject) => {
    const run = async () => {
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

    if (activeCount < MEDIA_SYNC_CONCURRENCY) {
      void run()

      return
    }

    pending.push(run)
  })
}

export const enqueueMediaSync = async (filename: string, task: MediaSyncTaskType) => {
  const current = inFlight.get(filename)

  if (current) {
    await current

    return
  }

  const request = runQueued(task)

  inFlight.set(filename, request)

  try {
    await request
  } finally {
    inFlight.delete(filename)
  }
}
