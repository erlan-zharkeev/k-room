import { model, Schema } from 'mongoose'

import { IUserSchema } from './types'
import { personalSchema } from './personal.model'
import { publicSchema } from './public.model'
import { systemSchema } from './system.model'

const userSchema = new Schema<IUserSchema>(
  {
    system: systemSchema,
    personal: personalSchema,
    public: publicSchema
  },
  { timestamps: true }
)

export const UserModel = model('User', userSchema, 'user')
