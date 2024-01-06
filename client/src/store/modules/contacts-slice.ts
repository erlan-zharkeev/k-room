import { createSlice } from '@reduxjs/toolkit'
import { SocketActionsPayload, Contact } from 'common-types'

interface ContactsState {
  isLoading: boolean
  contacts: Array<Contact>
}

const initialState: ContactsState = {
  isLoading: true,
  contacts: []
}

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    resetContactStore(state) {
      state.isLoading = true
      state.contacts = []
    },
    loadContacts(state, { payload }: { payload: Array<Contact> }) {
      state.contacts = payload
      state.isLoading = false
    },
    updateContactsStatus(state, { payload }: { payload: SocketActionsPayload['statusContact'] }) {
      const { interlocutorId, status } = payload
      state.contacts.forEach((user) => {
        if (user.id === interlocutorId) user.online = status
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
