import type {
  IFrontendUserData,
  IEventSearchContact,
  IEventSaveContact,
  IEventContactAddSuccess,
  IEventDeleteContact,
  IEventUpdateInteraction,
  IEventUpdateContactInteractionSuccess,
  IEventInviteReceived,
  SocketActionsType
} from 'common-types'
import type { SocketInstanceType } from 'shared/types'

import { transformUsersData, transformUserToContact } from '../../utils'
import {
  createContactInteraction,
  deleteContactById,
  emitContactInteractionUpdated,
  emitSearchedContacts,
  setContactInteraction,
  setUserStatus
} from '../helpers'
import { io } from '../../app/server'
import { UserModel } from 'entities/user'

const ObjectIdType = require('mongoose').Types.ObjectId

export const contactsSlice = (socket: SocketInstanceType) => {
  const { userId } = socket.data
  socket.on<SocketActionsType>('search-contact', async ({ value }: IEventSearchContact) => {
    let type = 'name'
    let validSearch = true
    if (value.includes('#')) {
      value = value.substring(1)
      ObjectIdType.isValid(value) ? (type = 'id') : (validSearch = false)
    }
    if (value.includes('@')) {
      type = 'email'
      value = value.split('@')[0]
    }
    if (!value) validSearch = false
    const $regex = new RegExp(value, 'i')
    const searchTypeMap: Record<
      string,
      Record<
        string,
        | {
          $regex: RegExp
        }
        | string
      >
    > = {
      name: { username: { $regex } },
      email: { email: { $regex } },
      id: { _id: value }
    }
    const searchType = searchTypeMap[type]
    if (!searchType) validSearch = false
    let searchedUsers: IFrontendUserData[] = []
    if (validSearch) {
      const users = await UserModel.find(searchType)
      searchedUsers = transformUsersData(users)
    }
    emitSearchedContacts(socket.id, searchedUsers)
  })

  socket.on<SocketActionsType>('save-contact', async ({ interlocutorId }: IEventSaveContact) => {
    const selfContact = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: { [`contacts.${interlocutorId}`]: { id: interlocutorId, interaction: 'default', updatedAt: Date.now() } }
      },
      { new: true }
    )
    const contactCandidate = await UserModel.findOne({ _id: interlocutorId })
    if (selfContact && contactCandidate) {
      const dbContact = selfContact.contacts[interlocutorId]
      if (dbContact) {
        const payload: IEventContactAddSuccess = {
          contactData: transformUserToContact(contactCandidate, dbContact)
        }
        io.to(socket.id).emit<SocketActionsType>('contact-add-success', payload)
      }
    }
  })

  socket.on<SocketActionsType>('delete-contact', async ({ deletingUserId }: IEventDeleteContact) => {
    await deleteContactById(userId, deletingUserId, socket.id)
  })

  socket.on<SocketActionsType>('interlocutor-ping', async () => {
    await setUserStatus(userId, true)
  })

  socket.on<SocketActionsType>(
    'update-contact-interaction-type',
    async ({ contactId, interaction }: IEventUpdateInteraction) => {
      const updateAuthorContactInteraction = async () => setContactInteraction(userId, contactId, interaction)
      const updateContactInteraction = async () => setContactInteraction(contactId, userId, interaction)
      const handleUpdateContactInteraction = async () => {
        const updatedContact = await updateContactInteraction()
        if (!updatedContact) return
        emitContactInteractionUpdated(updatedContact.socketId, userId, interaction)
      }

      switch (interaction) {
        case 'default': {
          await deleteContactById(userId, contactId, socket.id)
          await handleUpdateContactInteraction()
          break
        }
        case 'invited': {
          const contactData = await createContactInteraction(contactId, userId, 'invite-received')
          const authorData = await updateAuthorContactInteraction()
          if (!contactData || !authorData) return
          const { id, username, email, online, avatar, lastSeen } = authorData
          const payload: IEventInviteReceived = {
            contactData: {
              id,
              username,
              email,
              online,
              avatar,
              lastSeen,
              interaction: 'invite-received'
            }
          }
          io.to(contactData.socketId).emit<SocketActionsType>('invite-received', payload)
          break
        }
        case 'invite-accepted': {
          await updateAuthorContactInteraction()
          await handleUpdateContactInteraction()
          break
        }
      }

      const payload: IEventUpdateContactInteractionSuccess = { contactId, interaction }
      io.to(socket.id).emit<SocketActionsType>('contact-interaction-updated', payload)
    }
  )
}
