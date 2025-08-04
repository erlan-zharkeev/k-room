import { Schema, model } from 'mongoose'
import { publicSchema } from './public.model'
import { systemSchema } from './system.model'
import { personalSchema } from './personal.model'

const userSchema = new Schema({
  system: {
    type: systemSchema,
    required: true
  },
  personal: {
    type: personalSchema,
    required: true
  },
  public: {
    type: publicSchema,
    required: true
  }
})

export const UserModel = model('User', userSchema, 'user')
