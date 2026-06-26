export const hasRoomCallAudioOutputStream = (stream: MediaStream | undefined): stream is MediaStream =>
  Boolean(stream?.getAudioTracks().length)
