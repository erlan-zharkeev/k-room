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
    }
  }
})

export const { loadContacts, updateContactsStatus } = contactsSlice.actions

export default contactsSlice.reducer
