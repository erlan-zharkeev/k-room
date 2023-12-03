import mongoose from 'mongoose'
import { serverConstants } from '../server-constants'
import { Author, MessageStatus } from '../@types'
import { MessageModel } from '../models'

export const loadMessageFixtures = async () => {
  return await Promise.all(
    serverConstants.messages.system.map(async (systemMessage) => {
      const _id = new mongoose.Types.ObjectId(systemMessage.id)
      const messageCandidate = await MessageModel.findOne({ _id })
      if (messageCandidate) return
      const message = new MessageModel({
        _id,
        authorId: Author.system,
        authorName: Author.system,
        status: MessageStatus.none,
        body: systemMessage.text,
        createdAt: Date.now(),
        usersMetaData: []
      })
      await message.save()
    })
  )
}
