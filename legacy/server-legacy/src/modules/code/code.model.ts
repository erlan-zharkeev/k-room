import { model, Schema } from 'mongoose'

import { codePurposeSchema } from './code-purpose.model'
import { CodeSchema } from './types'

const codesSchema = new Schema<CodeSchema>({
  codes: codePurposeSchema,
  nextRequestPossibleAt: { type: Number, default: 0 }
})

export const CodeModel = model('Code', codesSchema, 'code')
