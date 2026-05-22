import { Schema } from 'mongoose'

import { codeMethodSchema } from './code-method.model'
import { CodePurpose } from './types'

export const codePurposeSchema = new Schema<CodePurpose>(
  {
    passwordRecovery: { type: codeMethodSchema, required: true, default: {} }
  },
  { _id: false }
)
