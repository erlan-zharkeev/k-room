import { isString } from 'global-shared'
import { Types } from 'mongoose'

import type { MongoIdType } from '../types/mongo'

export const normalizeObjectId = (value: MongoIdType) => {
  return isString(value) ? new Types.ObjectId(value) : value
}
