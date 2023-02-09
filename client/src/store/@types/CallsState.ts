import { Call, StreamSettings } from 'common-types'

export interface CallsState {
  showCallModal: boolean
  isMinified: boolean
  currentCall: Call
  call: any
  list: Array<Call>
  settings: StreamSettings
}
