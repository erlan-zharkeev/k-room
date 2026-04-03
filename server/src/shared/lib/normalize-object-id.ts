import { Types } from 'mongoose'

export const normalizeObjectId = (value: string | Types.ObjectId) =>
  typeof value === 'string' ? new Types.ObjectId(value) : value
