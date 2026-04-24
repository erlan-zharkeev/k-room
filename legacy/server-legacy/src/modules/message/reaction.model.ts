import { IReaction } from 'common'
import { Schema } from 'mongoose'

export const reactionSchema = new Schema<IReaction>({
  username: { type: String, required: true },
  authorId: { type: String, required: true },
  glyphKey: { type: String, required: true }
})
