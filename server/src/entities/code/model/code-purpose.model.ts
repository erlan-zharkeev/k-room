import { Schema } from 'mongoose'
import { codeMethodSchema, ICodePurpose } from 'src/entities/code'

export const codePurposeSchema = new Schema<ICodePurpose>(
  {
    passwordRecovery: { type: codeMethodSchema, required: true, default: {} }
  },
  { _id: false }
)
