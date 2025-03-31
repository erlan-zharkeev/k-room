import { StatusEnum } from '../../../types'
import { SharpConfig, SharpSettingsKey } from './sharp'

export interface ServerConstants {
  sharp: Record<SharpSettingsKey, SharpConfig>
  maxMbQuantityTransfer: number
}

export interface ErrorResponse<T> {
  message: T
  status: StatusEnum
  data: unknown
  silent: boolean
}
