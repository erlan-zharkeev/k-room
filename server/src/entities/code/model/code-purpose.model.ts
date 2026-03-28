import { Schema } from 'mongoose'
import type { ICodePurpose } from '../config'
import { codeMethodSchema } from './code-method.model'

export const codePurposeSchema = new Schema<ICodePurpose>(
  {
    passwordRecovery: { type: codeMethodSchema, required: true, default: {} }
  },
  { _id: false }
)
