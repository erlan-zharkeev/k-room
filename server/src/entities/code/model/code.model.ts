import { model, Schema } from 'mongoose'

import { codePurposeSchema } from 'src/entities/code'
import { ICodeSchema } from 'src/entities/code/config'

const codesSchema = new Schema<ICodeSchema>({
  codes: codePurposeSchema,
  nextRequestPossibleAt: { type: Number, default: 0 }
})

export const CodeModel = model('Code', codesSchema, 'code')
