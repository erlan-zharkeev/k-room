import { CallModel } from '../../models'
import { getUserById } from '../../socket'
import { CallType } from '../../@types'

const getCallType = (answered: boolean, isIncoming: boolean) => {
  let type
  if (answered) {
    type = isIncoming ? 'incoming' : 'outgoing'
  } else {
    type = isIncoming ? 'missed' : 'no-answered'
  }
  return type as CallType
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
  const type = getCallType(call.answered, isIncoming)
  const { calledAt, startedAt, finishedAt, authorId, video } = call
  const transformedCall = {
    id: call._id,
    calledAt,
    startedAt,
    finishedAt,
    authorId,
    video,
    type,
    interlocutorId,
    authorName: author.username,
    interlocutorName: interlocutor.username,
    interlocutorAvatarPath: interlocutor.avatarPath
  }
  return transformedCall
}
