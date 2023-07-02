import { User } from 'common-types'

export interface ContactsState {
  isLoading: boolean
  contacts: Array<User>
}
