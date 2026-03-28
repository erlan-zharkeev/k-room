import { model, Schema } from 'mongoose'
import type { IUserSchema } from 'src/entities/user'
import { personalSchema,publicSchema, systemSchema  } from 'src/entities/user'


const userSchema = new Schema<IUserSchema>({
  system: systemSchema,
  personal: personalSchema,
  public: publicSchema
})

export const UserModel = model('User', userSchema, 'user')
