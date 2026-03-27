import { Schema } from 'mongoose'

import { codeElementSchema } from 'entities/code'
import { ICodeMethod } from 'entities/code/config'

export const codeMethodSchema = new Schema<ICodeMethod>(
  {
    query: codeElementSchema,
    email: codeElementSchema,
    sms: codeElementSchema
  },
  { _id: false }
)
