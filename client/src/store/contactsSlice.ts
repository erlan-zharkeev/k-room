import { createSlice } from '@reduxjs/toolkit'
import { ContactsState } from './@types/ContactsState'
import { SocketActionsPayload, User } from 'common-types'

const initialState: ContactsState = {
  isLoading: true,
  contacts: []
}

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    loadContacts(state, { payload }: { payload: Array<User> }) {
      state.contacts = payload
      state.isLoading = false
    },
    updateContactsStatus(state, { payload }: { payload: SocketActionsPayload['statusContact'] }) {
      const { userId, status } = payload
      state.contacts.forEach((user) => {
        if (user.id === userId) user.online = status
      })
    },
    updateContactData(state, { payload }: { payload: SocketActionsPayload['changeContactsData'] }) {
      const { id, username, avatarPath } = payload
      state.contacts.forEach((user) => {
        if (user.id !== id) return
        user.username = username
        user.avatarPath = avatarPath
      })
    }
  }
})

export const { loadContacts, updateContactsStatus, updateContactData } = contactsSlice.actions

export default contactsSlice.reducer
