import { beforeEach, describe, expect, it, vi } from 'vitest'

import { allowMediaSyncQueue, blockMediaSyncQueue, enqueueMediaSync } from './media-sync-queue'

describe('media sync queue', () => {
  beforeEach(() => {
    blockMediaSyncQueue()
    allowMediaSyncQueue()
  })

  it('deduplicates in-flight media sync by media id', async () => {
    let releaseTask = () => {}
    const task = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          releaseTask = resolve
        })
    )

    const first = enqueueMediaSync('media-1', task)
    const second = enqueueMediaSync('media-1', task)

    await Promise.resolve()
    expect(task).toHaveBeenCalledTimes(1)

    releaseTask()
    await Promise.all([first, second])

    expect(task).toHaveBeenCalledTimes(1)
  })

  it('resolves blocked media sync queue without running pending task', async () => {
    const task = vi.fn()

    blockMediaSyncQueue()
    await enqueueMediaSync('media-1', task)
    allowMediaSyncQueue()

    expect(task).not.toHaveBeenCalled()
  })
})
