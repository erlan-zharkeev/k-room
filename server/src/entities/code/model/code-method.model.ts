import { Schema } from 'mongoose'

import { ICodeMethod } from 'entities/code/config'
import { codeElementSchema } from 'entities/code/model/code-element.model'

export const codeMethodSchema = new Schema<ICodeMethod>(
  {
    query: codeElementSchema,
    email: codeElementSchema,
    sms: codeElementSchema
  },
  { _id: false }
)
