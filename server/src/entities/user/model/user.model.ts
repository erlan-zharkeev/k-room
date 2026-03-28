import { model, Schema } from 'mongoose'

import type { IUserSchema } from './../config'
import { personalSchema, publicSchema, systemSchema } from '.'

const userSchema = new Schema<IUserSchema>({
  system: systemSchema,
  personal: personalSchema,
  public: publicSchema
})

export const UserModel = model('User', userSchema, 'user')
