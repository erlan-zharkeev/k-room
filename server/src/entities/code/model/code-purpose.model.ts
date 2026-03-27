import { Schema } from 'mongoose'

import { codeMethodSchema } from 'entities/code'
import { ICodePurpose } from 'entities/code/config'

export const codePurposeSchema = new Schema<ICodePurpose>(
  {
    passwordRecovery: { type: codeMethodSchema, required: true, default: {} }
  },
  { _id: false }
)
