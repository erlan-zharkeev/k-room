import { Schema } from 'mongoose'

import { IImageObject } from 'common'

export const imageSchema = new Schema<Omit<IImageObject, 'fileBuffer'>>({
  // TODO Probably src or name redundant
  src: { type: String, required: true },
  name: { type: String, required: true }
})
