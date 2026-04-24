import { Types } from 'mongoose'

import type { MongoIdType } from '../types/mongo'

export const normalizeObjectId = (value: MongoIdType) => {
  return typeof value === 'string' ? new Types.ObjectId(value) : value
}
