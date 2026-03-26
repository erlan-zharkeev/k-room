import { Schema } from 'mongoose'

import { ICodePurpose } from 'entities/code/config'
import { codeMethodSchema } from 'entities/code/model/code-method.model'

export const codePurposeSchema = new Schema<ICodePurpose>(
  {
    passwordRecovery: { type: codeMethodSchema, required: true, default: {} }
  },
  { _id: false }
)
