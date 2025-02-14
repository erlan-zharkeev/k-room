import mongoose from 'mongoose'
import { serverConstants } from '../server-constants'
import { Author } from '../@types'
import { MessageModel } from '../models'

export const loadMessageFixtures = async () => {
  return await Promise.all(
    serverConstants.messages.system.map(async (systemMessage) => {
      const _id = new mongoose.Types.ObjectId(systemMessage.id)
      const messageCandidate = await MessageModel.findOne({ _id })
      if (messageCandidate) return
      const message = new MessageModel({
        _id,
        authorId: 'system',
        authorName: 'system',
        status: 'none',
        body: systemMessage.text,
        createdAt: Date.now(),
        usersMetaData: []
      })
      await message.save()
    })
  )
}
