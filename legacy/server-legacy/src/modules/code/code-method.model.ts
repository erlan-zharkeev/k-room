import { Schema } from 'mongoose'

import { codeElementSchema } from './code-element.model'
import { ICodeMethod } from './types'

export const codeMethodSchema = new Schema<ICodeMethod>(
  {
    query: codeElementSchema,
    email: codeElementSchema,
    sms: codeElementSchema
  },
  { _id: false }
)
