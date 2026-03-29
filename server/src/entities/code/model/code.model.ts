import { model, Schema } from 'mongoose'

import type { ICodeSchema } from 'src/entities/code/config'

import { codePurposeSchema } from './code-purpose.model'

const codesSchema = new Schema<ICodeSchema>({
  codes: codePurposeSchema,
  nextRequestPossibleAt: { type: Number, default: 0 }
})

export const CodeModel = model('Code', codesSchema, 'code')
