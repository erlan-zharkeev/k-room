import { model, Schema } from 'mongoose'

import type { CodeSchema } from './codes.types'

const codeElementSchema = new Schema(
  {
    value: {
      type: String,
      required: true,
      default: ''
    },
    expiresAt: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { _id: false }
)

const codeMethodSchema = new Schema(
  {
    query: {
      type: codeElementSchema,
      required: true,
      default: () => ({})
    },
    email: {
      type: codeElementSchema,
      required: true,
      default: () => ({})
    },
    sms: {
      type: codeElementSchema,
      required: true,
      default: () => ({})
    }
  },
  { _id: false }
)

const codePurposeSchema = new Schema(
  {
    passwordRecovery: {
      type: codeMethodSchema,
      required: true,
      default: () => ({})
    }
  },
  { _id: false }
)

const codeSchema = new Schema<CodeSchema>(
  {
    _id: {
      type: String,
      required: true
    },
    codes: {
      type: codePurposeSchema,
      required: true,
      default: () => ({})
    },
    nextRequestPossibleAt: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { versionKey: false }
)

export const CodeModel = model<CodeSchema>('Code', codeSchema, 'code')
