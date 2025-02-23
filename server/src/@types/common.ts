import { Status } from '../../../types'
import { SharpConfig, SharpSettingsKey } from './sharp'

export interface ServerConstants {
  sharp: Record<SharpSettingsKey, SharpConfig>
  maxMbQuantityTransfer: number
}

export interface ErrorResponse<T> {
  message: T
  status: Status
  data: unknown
  silent: boolean
}
