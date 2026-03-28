import { Schema } from 'mongoose'

import { codeElementSchema } from 'src/entities/code'
import { ICodeMethod } from 'src/entities/code/config'

export const codeMethodSchema = new Schema<ICodeMethod>(
  {
    query: codeElementSchema,
    email: codeElementSchema,
    sms: codeElementSchema
  },
  { _id: false }
)
