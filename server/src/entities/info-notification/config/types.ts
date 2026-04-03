import { Types } from 'mongoose'

export type InfoNotificationFixtureType = {
  _id: Types.ObjectId
  title: {
    en: string
    ru: string
  }
  content: {
    en: string[]
    ru: string[]
  }
  isActive: boolean
  createdAt: number
  updatedAt: number
}
