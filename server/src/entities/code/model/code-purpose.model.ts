import { Schema } from 'mongoose'

import { codeMethodSchema } from 'src/entities/code'
import { ICodePurpose } from 'src/entities/code/config'

export const codePurposeSchema = new Schema<ICodePurpose>(
  {
    passwordRecovery: { type: codeMethodSchema, required: true, default: {} }
  },
  { _id: false }
)
