export const isExpectedRoomCallPeerSignalError = (error: unknown) => {
  if (!(error instanceof DOMException)) {
    return false
  }

  return error.name === 'InvalidStateError' || error.name === 'OperationError'
}

export const isRoomCallPeerTimeoutError = (error: unknown) => {
  return error instanceof DOMException && error.name === 'TimeoutError'
}

export const isRecoverableRoomCallPeerDescriptionError = (error: unknown) => {
  if (!(error instanceof DOMException)) {
    return false
  }

  return error.name === 'InvalidModificationError' && error.message.toLowerCase().includes('sdp')
}
