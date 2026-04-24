import { CallFlowType, ICall } from 'common'

import { UserModel } from 'src/modules/user'

import { CallModel } from '../../call.model'

const getFlowType = (answered: boolean, isIncoming: boolean): CallFlowType => {
  if (answered) {
    return isIncoming ? 'incoming' : 'outgoing'
  }

  return isIncoming ? 'missed' : 'not-answered'
}

export const transformCallForUser = async (userId: string, callId: string): Promise<ICall | null> => {
  const call = await CallModel.findById(callId).lean()

  if (!call) return null

  const author = await UserModel.findById(call.authorId).lean()

  if (!author) return null

  const interlocutorId = call.interlocutors.find((interlocutor) => interlocutor !== userId)

  if (!interlocutorId) return null

  const interlocutor = await UserModel.findById(interlocutorId).lean()

  if (!interlocutor) return null

  const isIncoming = userId !== call.authorId

  return {
    id: String(call._id),
    calledAt: call.calledAt,
    startedAt: call.startedAt ?? 0,
    finishedAt: call.finishedAt,
    authorId: call.authorId,
    authorName: author.public.username,
    interlocutorId,
    interlocutorName: interlocutor.public.username,
    interlocutorAvatarPath: `avatar.${interlocutorId}`,
    flow: getFlowType(call.answered, isIncoming),
    video: Boolean(call.video)
  }
}
