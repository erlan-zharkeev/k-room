import { model, Schema } from 'mongoose'

import { ICodeSchema } from 'entities/code/config'
import { codePurposeSchema } from 'entities/code/model/code-purpose.model'

const codesSchema = new Schema<ICodeSchema>({
  codes: codePurposeSchema,
  nextRequestPossibleAt: { type: Number, default: 0 }
})

export const CodeModel = model('Code', codesSchema, 'code')
