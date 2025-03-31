import { UserModel } from '../../models'
import {
  SocketInstanceType,
  IUserData,
  IEventSearchContact,
  IEventSaveContact,
  IEventContactAddSuccess,
  IEventDeleteContact,
  IEventUpdateInteraction,
  IEventUpdateContactInteractionSuccess,
  IEventInviteReceived,
  SocketActionsType
} from '../../@types'
import { transformUsersData, transformUserToContact } from '../../utils'
import { deleteContactById, emitSearchedContacts, setUserStatus } from '../helpers'
import { io } from '../../server'

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
    let searchedUsers: IUserData[] = []
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
        $set: { [`contacts.${interlocutorId}`]: { id: interlocutorId, interaction: 'default' } }
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
      const updateContactInteractionTypeInAuthor = async () => {
        return await UserModel.findOneAndUpdate(
          { _id: userId, [`contacts.${contactId}`]: { $exists: true } },
          {
            $set: { [`contacts.${contactId}.interaction`]: interaction }
          }
        )
      }
      const updateContactInteractionTypeInContact = async () => {
        const contactCandidate = await UserModel.findOneAndUpdate(
          { _id: contactId, [`contacts.${userId}`]: { $exists: true } },
          {
            $set: { [`contacts.${userId}.interaction`]: interaction }
          }
        )
        if (contactCandidate) {
          const payload: IEventUpdateContactInteractionSuccess = {
            contactId: userId,
            interaction
          }
          io.to(contactCandidate.socketId).emit<SocketActionsType>('contact-interaction-type-updated', payload)
        }
      }
      if (interaction === 'default') {
        await deleteContactById(userId, contactId, socket.id)
        await updateContactInteractionTypeInContact()
      }
      if (interaction === 'invited') {
        const contactData = await UserModel.findOneAndUpdate(
          { _id: contactId },
          { $set: { [`contacts.${userId}`]: { id: userId, interaction: 'invite-received' } } }
        )
        const selfContact = await updateContactInteractionTypeInAuthor()
        if (contactData && selfContact) {
          const { id, username, email, online, avatarPath, lastSeen } = selfContact
          const payload: IEventInviteReceived = {
            contactData: {
              id,
              username,
              email,
              online,
              avatarPath,
              lastSeen,
              interaction: 'invite-received'
            }
          }
          io.to(contactData.socketId).emit<SocketActionsType>('invite-received', payload)
        }
      }
      if (interaction === 'invite-accepted') {
        await updateContactInteractionTypeInAuthor()
        await updateContactInteractionTypeInContact()
      }

      const payload: IEventUpdateContactInteractionSuccess = { contactId, interaction }
      io.to(socket.id).emit<SocketActionsType>('contact-interaction-type-updated', payload)
    }
  )
}
