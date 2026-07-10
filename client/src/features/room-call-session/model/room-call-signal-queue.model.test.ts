import type { EventRoomCallSignalReceived, RoomCallSignalKind } from 'global-shared'
import { describe, expect, it } from 'vitest'

import { createRoomCallSignalQueue } from './room-call-signal-queue.model'

const createSignal = (
  roomCallId: string,
  fromUserId: string,
  signalKind: RoomCallSignalKind = 'offer'
): EventRoomCallSignalReceived => ({
  fromUserId,
  roomCallId,
  signal: { type: signalKind, sdp: 'v=0' },
  signalId: `${roomCallId}-${fromUserId}-${signalKind}`,
  signalKind
})

describe('room call signal queue', () => {
  it('queues only signals for the room call currently being joined', () => {
    const queue = createRoomCallSignalQueue()
    const firstSignal = createSignal('call-1', 'user-a')
    const secondSignal = createSignal('call-1', 'user-b', 'ice-candidate')
    const otherCallSignal = createSignal('call-2', 'user-c')

    expect(queue.queueJoiningRoomCallSignal(firstSignal)).toBe(false)

    queue.startJoiningRoomCall('call-1')

    expect(queue.queueJoiningRoomCallSignal(firstSignal)).toBe(true)
    expect(queue.queueJoiningRoomCallSignal(otherCallSignal)).toBe(false)
    expect(queue.queueJoiningRoomCallSignal(secondSignal)).toBe(true)
    expect(queue.flushRoomCallSignals('call-1')).toEqual([firstSignal, secondSignal])
    expect(queue.flushRoomCallSignals('call-1')).toEqual([])
    expect(queue.flushRoomCallSignals('call-2')).toEqual([])
  })

  it('clears pending signals when joining is stopped', () => {
    const queue = createRoomCallSignalQueue()

    queue.startJoiningRoomCall('call-1')
    queue.queueJoiningRoomCallSignal(createSignal('call-1', 'user-a'))
    queue.stopJoiningRoomCall('call-1')

    expect(queue.queueJoiningRoomCallSignal(createSignal('call-1', 'user-b'))).toBe(false)
    expect(queue.flushRoomCallSignals('call-1')).toEqual([])
  })
})
