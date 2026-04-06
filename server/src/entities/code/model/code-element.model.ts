import { Schema } from 'mongoose'

import { ICodeElement } from 'src/entities/code'

export const codeElementSchema = new Schema<ICodeElement>(
  {
    value: { type: String, required: true, default: '' },
    expiresAt: { type: Number, required: true, default: 0 }
  },
  { _id: false }
)
