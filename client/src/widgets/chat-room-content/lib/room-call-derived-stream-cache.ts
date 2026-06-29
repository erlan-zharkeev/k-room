import type { RoomCallDerivedStreamCacheItem } from './types'

const buildRoomCallDerivedStreamTrackKey = (tracks: MediaStreamTrack[]) => tracks.map(({ id }) => id).join(':')

export const createRoomCallDerivedStreamCache = () => {
  const streamById = new Map<string, RoomCallDerivedStreamCacheItem>()

  const resolve = (id: string, tracks: MediaStreamTrack[]) => {
    if (!tracks.length) {
      streamById.delete(id)
      return undefined
    }

    const trackKey = buildRoomCallDerivedStreamTrackKey(tracks)
    const cachedStream = streamById.get(id)

    if (cachedStream?.trackKey === trackKey) {
      return cachedStream.stream
    }

    const stream = new MediaStream(tracks)

    streamById.set(id, {
      stream,
      trackKey
    })

    return stream
  }

  const clear = () => {
    streamById.clear()
  }

  return {
    clear,
    resolve
  }
}
