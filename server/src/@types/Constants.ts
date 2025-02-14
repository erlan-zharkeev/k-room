import { Status } from '../../../types'
import { SharpSettingsKey } from '../@enums'
import { SharpConfig } from './sharp'
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
