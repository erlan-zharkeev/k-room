import { KRoomUser } from 'common-types'

export interface ContactsState {
  isLoading: boolean
  contacts: Array<KRoomUser>
}
