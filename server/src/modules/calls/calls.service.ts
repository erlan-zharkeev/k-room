import type { CallFlowType, EventCallUpdatedType, EventCallsUpdatedType, ICall } from 'global-shared'

import { emitToUsers } from '../presence/presence.utils'
import { UserModel } from '../user/user.model'

import { CallModel } from './calls.model'

const resolveFlowType = (answered: boolean, isIncoming: boolean): CallFlowType => {
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
    flow: resolveFlowType(call.answered, userId !== call.authorId),
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
  emitToUsers([userId], 'calls-data-loaded', payload)
}

export const emitCallDataToInterlocutors = async (interlocutors: string[], callId: string, setId?: boolean) => {
  await Promise.all(
    interlocutors.map(async (interlocutorId) => {
      const transformedCall = await transformCallForUser(interlocutorId, callId)

      if (!transformedCall) {
        return
      }

      const payload: EventCallUpdatedType = {
        ...transformedCall,
        setId
      }

      emitToUsers([interlocutorId], 'call-data-changed', payload)
    })
  )
}
