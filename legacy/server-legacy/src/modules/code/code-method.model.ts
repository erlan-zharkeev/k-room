import { Schema } from 'mongoose'

import { codeElementSchema } from './code-element.model'
import { CodeMethod } from './types'

export const codeMethodSchema = new Schema<CodeMethod>(
  {
    query: codeElementSchema,
    email: codeElementSchema,
    sms: codeElementSchema
  },
  { _id: false }
)
