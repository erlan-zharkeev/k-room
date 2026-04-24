import { Types } from 'mongoose'

import type { MongoIdType } from 'src/shared/config'

export const normalizeObjectId = (value: MongoIdType) => (typeof value === 'string' ? new Types.ObjectId(value) : value)
