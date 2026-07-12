import { beforeEach, describe, expect, it } from 'vitest'

import {
  markSocketDataSnapshotLoaded,
  socketDataStatus,
  startSocketDataLoading,
  stopSocketDataLoading
} from './socket-data-status'

describe('socket data status', () => {
  beforeEach(() => {
    stopSocketDataLoading()
  })

  it('stays loading until every initial data snapshot is stored', () => {
    startSocketDataLoading()

    expect(socketDataStatus.isLoading.value).toBe(true)

    markSocketDataSnapshotLoaded('actual-contacts')
    markSocketDataSnapshotLoaded('actual-chat-rooms')

    expect(socketDataStatus.isLoading.value).toBe(true)

    markSocketDataSnapshotLoaded('room-calls-updated')

    expect(socketDataStatus.isLoading.value).toBe(false)
  })

  it('stops loading when socket data actualization is cancelled', () => {
    startSocketDataLoading()
    stopSocketDataLoading()

    expect(socketDataStatus.isLoading.value).toBe(false)
  })
})
