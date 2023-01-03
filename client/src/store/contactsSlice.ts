import { createSlice } from '@reduxjs/toolkit'
import { ContactsState } from './@types/ContactsState'

const initialState: ContactsState = {
  contacts: []
}

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    loadContacts(state, action) {
      state.contacts = action.payload
    },
    updateContactsStatus(state, action) {
      const { userId, status } = action.payload
      state.contacts.forEach((user) => {
        if (user.id === userId) user.online = status
      })
    },
    updateContactData(state, action) {
      const { id, username, avatar } = action.payload
      state.contacts.forEach((user) => {
        if (user.id !== id) return
        user.username = username
        user.avatar = avatar
      })
    }
  }
})

export const { loadContacts, updateContactsStatus, updateContactData } = contactsSlice.actions

export default contactsSlice.reducer
