import { describe, expect, it } from 'vitest'

import { isExpectedRoomCallPeerSignalError, isRecoverableRoomCallPeerDescriptionError } from './room-call-peer-error'

describe('room call peer error helpers', () => {
  it('detects expected transient peer signal errors', () => {
    expect(isExpectedRoomCallPeerSignalError(new DOMException('', 'InvalidStateError'))).toBe(true)
    expect(isExpectedRoomCallPeerSignalError(new DOMException('', 'OperationError'))).toBe(true)
  })

  it('detects recoverable SDP description errors', () => {
    const error = new DOMException('SDP is modified in a non-acceptable way', 'InvalidModificationError')

    expect(isRecoverableRoomCallPeerDescriptionError(error)).toBe(true)
  })

  it('rejects unrelated peer errors', () => {
    expect(isExpectedRoomCallPeerSignalError(new Error('failed'))).toBe(false)
    expect(isRecoverableRoomCallPeerDescriptionError(new DOMException('failed', 'InvalidModificationError'))).toBe(
      false
    )
  })
})
