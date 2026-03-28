import type { EventCallsUpdatedType, SocketActionsType } from 'common'

import { getSocketsByUserIds } from 'src/features/user'

import { CallModel } from 'src/entities/call'

import { getIO } from 'src/shared/lib'

import { transformCallForUser } from '.'

export const emitCallsToUser = async (userId: string) => {
  const calls = await CallModel.find({ interlocutors: { $in: [userId] } })
    .sort({ calledAt: -1 })
    .lean()

  const transformedCalls = await Promise.all(calls.map(async (call) => transformCallForUser(userId, String(call._id))))

  const payload = transformedCalls.filter(
    (call): call is NonNullable<typeof call> => call !== null
  ) as EventCallsUpdatedType
  const socketIds = await getSocketsByUserIds([userId])

  socketIds.forEach((socketId) => {
    getIO().to(socketId).emit<SocketActionsType>('calls-data-loaded', payload)
  })
}
