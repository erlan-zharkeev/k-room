import { Call, UserMediaType } from 'common-types'

export interface StreamConstraints {
  [UserMediaType.audio]: {
    loading: boolean
    value: boolean
  }
  [UserMediaType.video]: {
    loading: boolean
    value: boolean
  }
}

export interface CallsState {
  showCallModal: boolean
  isMinified: boolean
  currentCall: Call
  list: Array<Call>
  settings: StreamConstraints
}
