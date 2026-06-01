import { isString } from 'global-shared'
import { Types } from 'mongoose'

import type { MongoId } from '../types/mongo'

export const normalizeObjectId = (value: MongoId) => {
  return isString(value) ? new Types.ObjectId(value) : value
}

export const isValidMongoId = (value: string) => Types.ObjectId.isValid(value)

export const stringifyMongoId = (value: MongoId) => String(value)

export const stringifyMongoIds = (values: readonly MongoId[]) => values.map(stringifyMongoId)
