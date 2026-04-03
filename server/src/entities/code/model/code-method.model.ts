import { Schema } from 'mongoose'

import { ICodeMethod } from 'src/entities/code/config'

import { codeElementSchema } from './code-element.model'

export const codeMethodSchema = new Schema<ICodeMethod>(
  {
    query: codeElementSchema,
    email: codeElementSchema,
    sms: codeElementSchema
  },
  { _id: false }
)
