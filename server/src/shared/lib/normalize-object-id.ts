import { isString } from 'lodash'
import { Types } from 'mongoose'

import type { MongoId } from '../types/mongo'

export const normalizeObjectId = (value: MongoId) => {
  return isString(value) ? new Types.ObjectId(value) : value
}
