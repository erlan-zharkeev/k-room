import { Call, StreamSettings } from 'common-types'

export interface CallsState {
  showCallModal: boolean
  isMinified: boolean
  currentCall: Call
  connection: any
  list: Array<Call>
  settings: StreamSettings
}
