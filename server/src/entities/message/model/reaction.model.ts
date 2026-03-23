import { Schema } from "mongoose"

import { IReaction } from "common-types"

export const reactionSchema = new Schema<IReaction>({
  username: { type: String, required: true },
  authorId: { type: String, required: true },
  glyphKey: { type: String, required: true }
})