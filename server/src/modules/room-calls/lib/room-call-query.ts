export const buildActiveRoomCallParticipantFilter = (userId: string, socketId: string) => ({
  participants: {
    $elemMatch: {
      userId,
      socketId,
      leftAt: { $exists: false }
    }
  }
})
