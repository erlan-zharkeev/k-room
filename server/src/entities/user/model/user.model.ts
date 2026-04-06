import { model, Schema } from 'mongoose'

import { IUserSchema } from './../config'

import { personalSchema, publicSchema, systemSchema } from './index'

const userSchema = new Schema<IUserSchema>(
  {
    system: systemSchema,
    personal: personalSchema,
    public: publicSchema
  },
  { timestamps: true }
)

export const UserModel = model('User', userSchema, 'user')
