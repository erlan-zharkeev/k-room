import { createSlice } from '@reduxjs/toolkit'
import { SocketActionsPayload, Contact } from 'common-types'

interface ContactsState {
  contacts: Array<Contact>
}

const initialState: ContactsState = {
  contacts: []
}

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    resetContactStore(state) {
      state.contacts = []
    },
    loadContacts(state, { payload }: { payload: Array<Contact> }) {
      state.contacts = payload
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
