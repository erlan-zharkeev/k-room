import { createSlice } from '@reduxjs/toolkit'
import { ContactType, InteractionType, IEventStatusContact, IEventChangeContactsData } from 'common-types'

export type SliceContact = ContactType & { onlineStatusUpdatedTimestamp: number; isTyping: boolean }

interface ContactsState {
  contacts: SliceContact[]
}

const initialState: ContactsState = {
  contacts: []
}

const initialContactValues = {
  onlineStatusUpdatedTimestamp: Date.now(),
  isTyping: false
}

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    resetContactStore(state) {
      state.contacts = []
    },
    loadContacts(state, { payload }: { payload: ContactType[] }) {
      state.contacts = payload.map((contact) => ({
        ...contact,
        ...initialContactValues
      }))
    },
    updateContactsStatus(state, { payload }: { payload: IEventStatusContact }) {
      const { interlocutorId, online, onlineStatusUpdatedTimestamp } = payload
      state.contacts.forEach((user) => {
        if (user.id === interlocutorId) {
          user.online = online
          user.onlineStatusUpdatedTimestamp = onlineStatusUpdatedTimestamp
        }
      })
    },
    updateContactsStatusLocal(state, { payload }: { payload: { contactId: string; online: boolean } }) {
      const contact = state.contacts.find((contact) => contact.id === payload.contactId)
      if (contact) contact.online = payload.online
    },
    updateContactData(state, { payload }: { payload: IEventChangeContactsData }) {
      const { id, username, avatarPath } = payload
      state.contacts.forEach((user) => {
        if (user.id !== id) return
        user.username = username
        user.avatarPath = avatarPath
      })
    },
    updateContactInteractionType(state, { payload }: { payload: { contactId: string; interaction: InteractionType } }) {
      const contact = state.contacts.find((contact) => contact.id === payload.contactId)
      if (contact) contact.interaction = payload.interaction
    },
    updateContactTypingStatus(state, { payload }: { payload: { contactId: string; status: boolean } }) {
      const contact = state.contacts.find((contact) => contact.id === payload.contactId)
      if (contact) {
        contact.isTyping = payload.status
      }
    },
    addContact(state, { payload }: { payload: { contactData: ContactType } }) {
      const data = { ...payload.contactData, ...initialContactValues }
      state.contacts.push(data)
    },
    processInvitation(state, { payload }: { payload: { contactData: ContactType } }) {
      const contactIndex = state.contacts.findIndex((contact) => contact.id === payload.contactData.id)
      if (contactIndex !== -1) {
        state.contacts[contactIndex] = {
          ...state.contacts[contactIndex],
          ...payload.contactData,
          onlineStatusUpdatedTimestamp: Date.now()
        }
        return
      }
      state.contacts.push({ ...payload.contactData, ...initialContactValues })
    },
    deleteContact(state, { payload }: { payload: { contactId: string } }) {
      state.contacts = state.contacts.filter((contact) => contact.id !== payload.contactId)
    }
  }
})

export const {
  loadContacts,
  updateContactsStatus,
  updateContactsStatusLocal,
  updateContactData,
  addContact,
  updateContactInteractionType,
  resetContactStore,
  deleteContact,
  updateContactTypingStatus,
  processInvitation
} = contactsSlice.actions
