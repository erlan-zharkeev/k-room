import { MessageStatus } from '../../../types'
import { MessageModel } from '../models/message.model'
import constants from '../constants'
import mongoose from 'mongoose'

export const loadMessageFixtures = async () => {
  return await Promise.all(
    constants.messages.system.map(async (systemMessage) => {
      const _id = new mongoose.Types.ObjectId(systemMessage.id)
      const messageCandidate = await MessageModel.findOne({ _id })
      if (messageCandidate) return
      const message = new MessageModel({
        _id,
        authorId: 'system',
        authorName: 'system',
        status: MessageStatus.none,
        body: systemMessage.text,
        createdAt: Date.now(),
        usersMetaData: []
      })
      await message.save()
    })
  )
}
