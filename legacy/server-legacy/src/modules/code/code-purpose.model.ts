import { Schema } from 'mongoose'

import { codeMethodSchema } from './code-method.model'
import { ICodePurpose } from './types'

export const codePurposeSchema = new Schema<ICodePurpose>(
  {
    passwordRecovery: { type: codeMethodSchema, required: true, default: {} }
  },
  { _id: false }
)
