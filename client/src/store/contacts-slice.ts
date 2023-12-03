import { createSlice } from '@reduxjs/toolkit'
import { ContactsState } from './@types/contacts-state'
import { SocketActionsPayload, KRoomUser } from 'common-types'

const initialState: ContactsState = {
  isLoading: true,
  contacts: []
}

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    loadContacts(state, { payload }: { payload: Array<KRoomUser> }) {
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

export const { loadContacts, updateContactsStatus, updateContactData } = contactsSlice.actions

export default contactsSlice.reducer
