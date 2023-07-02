import { createSlice } from '@reduxjs/toolkit'
import { ContactsState } from './@types/ContactsState'

const initialState: ContactsState = {
  isLoading: true,
  contacts: []
}

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    loadContacts(state, { payload }) {
      state.contacts = payload
      state.isLoading = false
    },
    updateContactsStatus(state, { payload }) {
      const { userId, status } = payload
      state.contacts.forEach((user) => {
        if (user.id === userId) user.online = status
      })
    },
    updateContactData(state, { payload }) {
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
