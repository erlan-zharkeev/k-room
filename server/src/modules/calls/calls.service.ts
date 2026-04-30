import type { CallFlowType, EventCallUpdatedType, EventCallsUpdatedType, ICall, SocketActionsType } from 'global-shared'

import { getIO } from 'src/shared/lib/io'

import { UserModel } from '../user/user.model'
import { getSocketsByUserIds } from '../user/user.service'

import { CallModel } from './calls.model'

const activeCallInterlocutorMap = new Map<string, string>()

export const setActiveCallInterlocutor = (userId: string, interlocutorId: string) => {
  activeCallInterlocutorMap.set(userId, interlocutorId)
}

export const getActiveCallInterlocutor = (userId: string) => {
  return activeCallInterlocutorMap.get(userId) ?? null
}

export const clearActiveCallInterlocutor = (userId: string) => {
  activeCallInterlocutorMap.delete(userId)
}

const getFlowType = (answered: boolean, isIncoming: boolean): CallFlowType => {
  if (answered) {
    return isIncoming ? 'incoming' : 'outgoing'
  }

  return isIncoming ? 'missed' : 'not-answered'
}

export const transformCallForUser = async (userId: string, callId: string): Promise<ICall | null> => {
  const call = await CallModel.findById(callId).lean()

  if (!call) {
    return null
  }

  const author = await UserModel.findById(call.authorId).lean()

  if (!author) {
    return null
  }

  const interlocutorId = call.interlocutors.find((interlocutor) => interlocutor !== userId)

  if (!interlocutorId) {
    return null
  }

  const interlocutor = await UserModel.findById(interlocutorId).lean()

  if (!interlocutor) {
    return null
  }

  return {
    id: String(call._id),
    calledAt: call.calledAt,
    startedAt: call.startedAt ?? 0,
    finishedAt: call.finishedAt,
    authorId: call.authorId,
    authorNickname: author.public.nickname,
    interlocutorId,
    interlocutorNickname: interlocutor.public.nickname,
    interlocutorAvatarPath: `avatar.${interlocutorId}`,
    flow: getFlowType(call.answered, userId !== call.authorId),
    video: Boolean(call.video)
  }
}

export const emitCallsToUser = async (userId: string) => {
  const calls = await CallModel.find({ interlocutors: { $in: [userId] } })
    .sort({ calledAt: -1 })
    .lean()
  const transformedCalls = await Promise.all(calls.map(async (call) => transformCallForUser(userId, String(call._id))))
  const payload = transformedCalls.filter(
    (call): call is NonNullable<typeof call> => call !== null
  ) as EventCallsUpdatedType
  const sockets = await getSocketsByUserIds([userId])

  sockets.forEach((socketId) => {
    getIO().to(socketId).emit<SocketActionsType>('calls-data-loaded', payload)
  })
}

export const emitCallDataToInterlocutors = async (interlocutors: string[], callId: string, setId?: boolean) => {
  await Promise.all(
    interlocutors.map(async (interlocutorId) => {
      const transformedCall = await transformCallForUser(interlocutorId, callId)

      if (!transformedCall) {
        return
      }

      const sockets = await getSocketsByUserIds([interlocutorId])
      const payload: EventCallUpdatedType = {
        ...transformedCall,
        setId
      }

      sockets.forEach((socketId) => {
        getIO().to(socketId).emit<SocketActionsType>('call-data-changed', payload)
      })
    })
  )
}
