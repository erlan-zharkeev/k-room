import { Status } from '../../../types'
import { SharpConfig, SharpSettingsKey } from './sharp'
import { SystemMessage } from './system-message'

export interface ServerConstants {
  sharp: Record<SharpSettingsKey, SharpConfig>
  maxMbQuantityTransfer: number
  messages: {
    system: Array<SystemMessage>
  }
}

export interface ErrorResponse<T> {
  message: T
  status: Status
  data: unknown
  silent: boolean
}
