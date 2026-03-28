import { Schema } from 'mongoose'

import type { ICodeElement } from '../config'

export const codeElementSchema = new Schema<ICodeElement>(
  {
    value: { type: String, required: true, default: '' },
    expiresAt: { type: Number, required: true, default: 0 }
  },
  { _id: false }
)
