import { EventCallsUpdated, SocketActions } from 'common'

import { getSocketsByUserIds } from 'src/modules/user'

import { getIO } from 'src/shared/lib/io'

import { CallModel } from '../../call.model'

import { transformCallForUser } from './transform-call-for-user'

export const emitCallsToUser = async (userId: string) => {
  const calls = await CallModel.find({ interlocutors: { $in: [userId] } })
    .sort({ calledAt: -1 })
    .lean()

  const transformedCalls = await Promise.all(calls.map(async (call) => transformCallForUser(userId, String(call._id))))

  const payload = transformedCalls.filter(
    (call): call is NonNullable<typeof call> => call !== null
  ) as EventCallsUpdated
  const socketIds = await getSocketsByUserIds([userId])

  socketIds.forEach((socketId) => {
    getIO().to(socketId).emit<SocketActions>('calls-data-loaded', payload)
  })
}
