import { createSlice } from '@reduxjs/toolkit'
import { SocketActionsPayload, Contact, InteractionType } from 'common-types'

export type SliceContact = Contact & { onlineStatusUpdatedTimestamp: number }

interface ContactsState {
  contacts: Array<SliceContact>
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
      state.contacts = payload.map((contact) => ({
        ...contact,
        onlineStatusUpdatedTimestamp: Date.now()
      }))
    },
    updateContactsStatus(state, { payload }: { payload: SocketActionsPayload['statusContact'] }) {
      const { interlocutorId, online, onlineStatusUpdatedTimestamp } = payload
      state.contacts.forEach((user) => {
        if (user.id === interlocutorId) {
          user.online = online
          user.onlineStatusUpdatedTimestamp = onlineStatusUpdatedTimestamp
        }
      })
    },
    updateContactsStatusLocal(state, { payload }: { payload: { contactId: string, online: boolean } }) {
      const contact = state.contacts.find((contact) => contact.id === payload.contactId)
      if (contact) contact.online = payload.online
    },
    updateContactData(state, { payload }: { payload: SocketActionsPayload['changeContactsData'] }) {
      const { id, username, avatarPath } = payload
      state.contacts.forEach((user) => {
        if (user.id !== id) return
        user.username = username
        user.avatarPath = avatarPath
      })
    },
    updateContactInteractionType(state, { payload }: { payload: { contactId: string, interactionType: InteractionType } }) {
      const contact = state.contacts.find((contact) => contact.id === payload.contactId)
      if (contact) contact.interactionType = payload.interactionType
    },
    addContact(state, { payload }: { payload: SocketActionsPayload['inviteReceived'] }) {
      console.log('times');
      const data = { ...payload.contactData, onlineStatusUpdatedTimestamp: Date.now() }
      state.contacts.push(data)
    }
  }
})
