import { CallModel } from '../../models'
import { getUserById } from '../../socket'
import { CallFlowType } from 'common-types'

const getFlowType = (answered: boolean, isIncoming: boolean) => {
  let flow
  if (answered) {
    flow = isIncoming ? 'incoming' : 'outgoing'
  } else {
    flow = isIncoming ? 'missed' : 'no-answered'
  }
  return flow as CallFlowType
}

export const transformCallDataForUser = async (userId: string, callId: string) => {
  const call = await CallModel.findOne({ _id: callId })
  if (!call) return null
  const author = await getUserById(call.authorId)
  if (!author) return null
  const interlocutorId = call.interlocutors.filter((interlocutorId) => interlocutorId !== userId)[0]
  const interlocutor = await getUserById(interlocutorId)
  if (!interlocutor) return null
  const isIncoming = userId !== author?.id
  const flow = getFlowType(call.answered, isIncoming)
  const { calledAt, startedAt, finishedAt, authorId, video } = call
  const transformedCall = {
    id: call._id,
    calledAt,
    startedAt,
    finishedAt,
    authorId,
    video,
    flow,
    interlocutorId,
    authorName: author.username,
    interlocutorName: interlocutor.username,
    interlocutorAvatarPath: interlocutor.avatarPath
  }
  return transformedCall
}
