import type { MediaObject } from 'global-shared'

export const cloneMediaObjects = <Media extends MediaObject>(mediaObjects: readonly Media[]): Media[] =>
  mediaObjects.map((mediaObject) => ({ ...mediaObject }))
