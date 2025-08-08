import { model, Schema } from 'mongoose'

import type { IUserSchema } from '../config'
import { personalSchema } from './personal.model'
import { publicSchema } from './public.model'
import { systemSchema } from './system.model'

const userSchema = new Schema<IUserSchema>({
  system: systemSchema,
  personal: personalSchema,
  public: publicSchema
})

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id
    delete ret._id
  }
})

export const UserModel = model('User', userSchema, 'user')
