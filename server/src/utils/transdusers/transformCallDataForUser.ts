import { CallType } from '../../../../types'
import { CallModel } from '../../models/call.model'
import { getUserById } from '../../socket/helpers/getters/getUserById'

const getCallType = (answered: boolean, isIncoming: boolean): CallType => {
  let type
  if (answered) {
    type = isIncoming ? CallType.incoming : CallType.outgoing
  } else {
    type = isIncoming ? CallType.missed : CallType.notAnswered
  }
  return type
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
