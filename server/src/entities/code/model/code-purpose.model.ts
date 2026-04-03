import { Schema } from 'mongoose'

import { ICodePurpose } from 'src/entities/code/config'

import { codeMethodSchema } from './code-method.model'

export const codePurposeSchema = new Schema<ICodePurpose>(
  {
    passwordRecovery: { type: codeMethodSchema, required: true, default: {} }
  },
  { _id: false }
)
