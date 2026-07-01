import { isFunction } from 'global-shared'

export const canPlayAudioOutput = () => typeof Audio !== 'undefined'

export const canSelectAudioOutputDevice = () =>
  typeof HTMLMediaElement !== 'undefined' && isFunction(HTMLMediaElement.prototype.setSinkId)
