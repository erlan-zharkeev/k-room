import { Types } from 'mongoose'

import type { MongoId } from 'src/shared/config'

export const normalizeObjectId = (value: MongoId) => (typeof value === 'string' ? new Types.ObjectId(value) : value)
