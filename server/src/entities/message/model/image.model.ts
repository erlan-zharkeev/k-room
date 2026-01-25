import { IImageObject } from "common-types"
import { Schema } from "mongoose"

export const imageSchema = new Schema<Omit<IImageObject, 'fileBuffer'>>({
  // TODO Probably src or name redundant
  src: { type: String, required: true },
  name: { type: String, required: true }
})