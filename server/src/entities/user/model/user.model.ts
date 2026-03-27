import { model, Schema } from 'mongoose'

import { personalSchema } from 'entities/user'
import type { IUserSchema } from 'entities/user/config'
import { publicSchema } from 'entities/user/model'
import { systemSchema } from 'entities/user/model'

const userSchema = new Schema<IUserSchema>({
  system: systemSchema,
  personal: personalSchema,
  public: publicSchema
})

export const UserModel = model('User', userSchema, 'user')
