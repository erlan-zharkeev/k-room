let mediaRequestAbortController = new AbortController()

export const getMediaRequestSignal = () => mediaRequestAbortController.signal

export const abortMediaRequests = () => {
  mediaRequestAbortController.abort()
}

export const resetMediaRequests = () => {
  mediaRequestAbortController = new AbortController()
}
