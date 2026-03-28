import { model, Schema } from 'mongoose'

import { personalSchema } from 'src/entities/user'
import type { IUserSchema } from 'src/entities/user/config'
import { publicSchema } from 'src/entities/user/model'
import { systemSchema } from 'src/entities/user/model'

const userSchema = new Schema<IUserSchema>({
  system: systemSchema,
  personal: personalSchema,
  public: publicSchema
})

export const UserModel = model('User', userSchema, 'user')
