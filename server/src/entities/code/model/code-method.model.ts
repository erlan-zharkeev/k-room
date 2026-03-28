import { Schema } from 'mongoose'
import { codeElementSchema, ICodeMethod } from 'src/entities/code'

export const codeMethodSchema = new Schema<ICodeMethod>(
  {
    query: codeElementSchema,
    email: codeElementSchema,
    sms: codeElementSchema
  },
  { _id: false }
)
