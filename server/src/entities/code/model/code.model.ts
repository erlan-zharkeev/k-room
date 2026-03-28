import { model, Schema } from 'mongoose'
import { codePurposeSchema, ICodeSchema } from 'src/entities/code'

const codesSchema = new Schema<ICodeSchema>({
  codes: codePurposeSchema,
  nextRequestPossibleAt: { type: Number, default: 0 }
})

export const CodeModel = model('Code', codesSchema, 'code')
