import { Schema } from 'mongoose'

import { CodeElement } from './types'

export const codeElementSchema = new Schema<CodeElement>(
  {
    value: { type: String, required: true, default: '' },
    expiresAt: { type: Number, required: true, default: 0 }
  },
  { _id: false }
)
