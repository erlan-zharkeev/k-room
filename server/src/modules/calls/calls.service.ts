import type {
  CallFlow,
  EventAnswerCall,
  EventCallAccepted,
  EventCallStartedAt,
  EventCallUpdated,
  EventCallUser,
  EventCallsUpdated,
  EventCallEnded,
  Call
} from 'global-shared'

import { getIO } from 'src/shared/lib/io'
import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

import { emitToUsers } from '../presence/presence.utils'
import { loadUserPublicById } from '../user/lib/user-persistence'

import { CallModel } from './calls.model'
import type { CallDocument } from './calls.types'

const resolveFlowType = (answered: boolean, isIncoming: boolean): CallFlow => {
  if (answered) {
    return isIncoming ? 'incoming' : 'outgoing'
  }

  return isIncoming ? 'missed' : 'not-answered'
}

export const transformCallForUser = async (userId: string, callId: string): Promise<Call | null> => {
  const call = await CallModel.findById(callId).lean<CallDocument>()

  if (!call) {
    return null
  }

  const author = await loadUserPublicById(call.authorId)

  if (!author) {
    return null
  }

  const interlocutorId = call.interlocutors.find((interlocutor) => interlocutor !== userId)

  if (!interlocutorId) {
    return null
  }

  const interlocutor = await loadUserPublicById(interlocutorId)

  if (!interlocutor) {
    return null
  }

  return {
    id: stringifyMongoId(call._id),
    calledAt: call.calledAt,
    startedAt: call.startedAt ?? 0,
    finishedAt: call.finishedAt,
    authorId: call.authorId,
    authorNickname: author.public.nickname,
    interlocutorId,
    interlocutorNickname: interlocutor.public.nickname,
    interlocutorAvatarId: interlocutor.public.avatarId,
    flow: resolveFlowType(call.answered, userId !== call.authorId),
    video: Boolean(call.video)
  }
}

export const emitCallsToUser = async (userId: string) => {
  const calls = await CallModel.find({ interlocutors: { $in: [userId] } })
    .sort({ calledAt: -1 })
    .lean<CallDocument[]>()
  const transformedCalls = await Promise.all(
    calls.map(async (call) => transformCallForUser(userId, stringifyMongoId(call._id)))
  )
  const payload: EventCallsUpdated = transformedCalls.filter((call): call is Call => call !== null)
  emitToUsers([userId], 'calls-data-loaded', payload)
}

export const emitCallDataToInterlocutors = async (interlocutors: string[], callId: string, setId?: boolean) => {
  await Promise.all(
    interlocutors.map(async (interlocutorId) => {
      const transformedCall = await transformCallForUser(interlocutorId, callId)

      if (!transformedCall) {
        return
      }

      const payload: EventCallUpdated = {
        ...transformedCall,
        setId
      }

      emitToUsers([interlocutorId], 'call-data-changed', payload)
    })
  )
}

export const markCallAsVideo = async (callId: string) => {
  await CallModel.updateOne({ _id: callId }, { video: true })
}

export const callUser = async (userId: string, { signal, userToCall, avatar, callerNickname }: EventCallUser) => {
  if (!userToCall) {
    return
  }

  const interlocutor = await loadUserPublicById(userToCall)

  if (!interlocutor) {
    return
  }

  const call = await new CallModel({
    calledAt: Date.now(),
    authorId: userId,
    interlocutors: [userId, userToCall],
    answered: false
  }).save()
  const callId = stringifyMongoId(call._id)

  emitToUsers([userToCall], 'call-user', {
    callId,
    signal,
    from: userId,
    avatar,
    callerNickname
  })

  await emitCallDataToInterlocutors([userId, userToCall], callId, true)
}

export const answerCall = async ({ to, signal, selfSocketId, callId }: EventAnswerCall) => {
  const payload: EventCallAccepted = { signal }

  emitToUsers([to], 'call-accepted', payload)

  const call = await CallModel.findOneAndUpdate(
    { _id: callId },
    { startedAt: Date.now(), answered: true },
    { new: true }
  ).lean<CallDocument>()

  if (!call) {
    return
  }

  await emitCallDataToInterlocutors(call.interlocutors, stringifyMongoId(call._id))

  const startedAtPayload: EventCallStartedAt = Date.now()

  emitToUsers([to], 'call-started-at', startedAtPayload)
  getIO().to(selfSocketId).emit('call-started-at', startedAtPayload)
}

export const endCall = async ({ callerId, callId }: EventCallEnded) => {
  emitToUsers([callerId], 'call-ended')

  const call = await CallModel.findOneAndUpdate(
    { _id: callId },
    { finishedAt: Date.now() },
    { new: true }
  ).lean<CallDocument>()

  if (!call) {
    return
  }

  await emitCallDataToInterlocutors(call.interlocutors, stringifyMongoId(call._id))
}
