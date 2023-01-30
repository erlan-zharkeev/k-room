import { Call } from 'common-types'

export interface CallsState {
  showCallModal: boolean
  isMinified: boolean
  videoEnabled: boolean
  userVideoPositionRelative: boolean
  currentCall: Call
  list: Array<Call>
}
