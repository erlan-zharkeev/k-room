import { model, Schema } from 'mongoose'

import { codePurposeSchema } from 'entities/code'
import { ICodeSchema } from 'entities/code/config'

const codesSchema = new Schema<ICodeSchema>({
  codes: codePurposeSchema,
  nextRequestPossibleAt: { type: Number, default: 0 }
})

export const CodeModel = model('Code', codesSchema, 'code')
