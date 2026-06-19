import type { RoomCall } from 'global-shared'

export const createRoomCallTestFixture = (): RoomCall => ({
  id: 'call-1',
  roomId: 'room-1',
  initiatorId: 'user-1',
  calledAt: 100,
  status: 'calling',
  mediaKind: 'video',
  participants: [
    {
      userId: 'user-1',
      socketId: 'socket-1',
      joinedAt: 100,
      mediaState: {
        audio: true,
        video: true,
        screen: false
      }
    }
  ]
})
