import { UserModel } from '../../models'
import {
  SocketInstanceType,
  KRoomUser,
  EventSearchContact,
  EventSaveContact,
  EventContactAddSuccess,
  EventDeleteContact,
  EventUpdateInteractionType,
  EventUpdateContactInteractionTypeSuccess,
  EventInviteReceived,
  SocketActions
} from '../../@types'
import { transformUsersData, transformUserToContact } from '../../utils'
import { deleteContactById, emitSearchedContacts, setUserStatus } from '../helpers'
import { io } from '../../server'

const ObjectIdType = require('mongoose').Types.ObjectId

export const contactsSlice = (socket: SocketInstanceType) => {
  const { userId } = socket.data
  socket.on<SocketActions>('search-contact', async ({ value }: EventSearchContact) => {
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
    let searchedUsers: KRoomUser[] = []
    if (validSearch) {
      const users = await UserModel.find(searchType)
      searchedUsers = transformUsersData(users)
    }
    emitSearchedContacts(socket.id, searchedUsers)
  })
  socket.on<SocketActions>('save-contact', async ({ interlocutorId }: EventSaveContact) => {
    const selfContact = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: { [`contacts.${interlocutorId}`]: { id: interlocutorId, interactionType: 'default' } }
      },
      { new: true }
    )
    const contactCandidate = await UserModel.findOne({ _id: interlocutorId })
    if (selfContact && contactCandidate) {
      const dbContact = selfContact.contacts[interlocutorId]
      if (dbContact) {
        const payload: EventContactAddSuccess = {
          contactData: transformUserToContact(contactCandidate, dbContact)
        }
        io.to(socket.id).emit<SocketActions>('contact-add-success', payload)
      }
    }
  })

  socket.on<SocketActions>('delete-contact', async ({ deletingUserId }: EventDeleteContact) => {
    await deleteContactById(userId, deletingUserId, socket.id)
  })

  socket.on<SocketActions>('interlocutor-ping', async () => {
    await setUserStatus(userId, true)
  })

  socket.on<SocketActions>(
    'update-contact-interaction-type',
    async ({ contactId, interactionType }: EventUpdateInteractionType) => {
      const updateContactInteractionTypeInAuthor = async () => {
        return await UserModel.findOneAndUpdate(
          { _id: userId, [`contacts.${contactId}`]: { $exists: true } },
          {
            $set: { [`contacts.${contactId}.interactionType`]: interactionType }
          }
        )
      }
      const updateContactInteractionTypeInContact = async () => {
        const contactCandidate = await UserModel.findOneAndUpdate(
          { _id: contactId, [`contacts.${userId}`]: { $exists: true } },
          {
            $set: { [`contacts.${userId}.interactionType`]: interactionType }
          }
        )
        if (contactCandidate) {
          const payload: EventUpdateContactInteractionTypeSuccess = {
            contactId: userId,
            interactionType
          }
          io.to(contactCandidate.socketId).emit<SocketActions>('contact-interaction-type-updated', payload)
        }
      }
      if (interactionType === 'default') {
        await deleteContactById(userId, contactId, socket.id)
        await updateContactInteractionTypeInContact()
      }
      if (interactionType === 'invited') {
        const contactData = await UserModel.findOneAndUpdate(
          { _id: contactId },
          { $set: { [`contacts.${userId}`]: { id: userId, interactionType: 'invite-received' } } }
        )
        const selfContact = await updateContactInteractionTypeInAuthor()
        if (contactData && selfContact) {
          const { id, username, email, online, avatarPath, lastSeen } = selfContact
          const payload: EventInviteReceived = {
            contactData: {
              id,
              username,
              email,
              online,
              avatarPath,
              lastSeen,
              interactionType: 'invite-received'
            }
          }
          io.to(contactData.socketId).emit<SocketActions>('invite-received', payload)
        }
      }
      if (interactionType === 'invite-accepted') {
        await updateContactInteractionTypeInAuthor()
        await updateContactInteractionTypeInContact()
      }

      const payload: EventUpdateContactInteractionTypeSuccess = { contactId, interactionType }
      io.to(socket.id).emit<SocketActions>('contact-interaction-type-updated', payload)
    }
  )
}
