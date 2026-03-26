import { model, Schema } from 'mongoose'

import type { IUserSchema } from 'entities/user/config'
import { personalSchema } from 'entities/user/model/personal.model'
import { publicSchema } from 'entities/user/model/public.model'
import { systemSchema } from 'entities/user/model/system.model'

const userSchema = new Schema<IUserSchema>({
  system: systemSchema,
  personal: personalSchema,
  public: publicSchema
})

export const UserModel = model('User', userSchema, 'user')
