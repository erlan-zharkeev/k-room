import { Types } from 'mongoose'

import { IEventSearchContact, IFrontendContact, InteractionType, SocketActionsType } from 'common'

import { transformUserToContact } from 'src/features/user'

import { UserModel } from 'src/entities/user'

import { SocketInstanceType } from 'src/shared/config'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { CONTACT_I18N } from './../config'
import { SEARCH_CONTACT_RESULT_LIMIT } from './config'
import { emitSearchedContacts } from './lib'

export const searchContactController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'search-contact',
    socketErrorMiddleware(
      socket,
      async ({ value, offset = 0 }: IEventSearchContact) => {
        let type: 'name' | 'id' = 'name'
        let validSearch = true
        const normalizedValue = value?.trim() || ''
        let needle = normalizedValue
        const safeOffset = Math.max(0, offset)
        const safeLimit = SEARCH_CONTACT_RESULT_LIMIT

        if (!needle) validSearch = false

        if (needle.startsWith('#')) {
          needle = needle.substring(1)
          type = Types.ObjectId.isValid(needle) ? 'id' : 'name'
          if (type === 'name' && !needle) validSearch = false
        }

        const $regex = new RegExp(needle, 'i')

        const searchTypeMap: Record<
          typeof type,
          { 'public.username': { $regex: RegExp } } | { 'public.email': { $regex: RegExp } } | { _id: string }
        > = {
          name: { 'public.username': { $regex } },
          id: { _id: needle }
        }

        const searchFilter = validSearch ? searchTypeMap[type] : null

        let searchedUsers: IFrontendContact[] = []

        if (searchFilter) {
          const { userId } = socket.data
          const [users, currentUser] = await Promise.all([
            UserModel.find(searchFilter).sort({ 'public.username': 1 }),
            UserModel.findById(userId, { _id: 1, personal: 1 }).lean()
          ])

          const contactInteractionMap = currentUser?.personal?.contacts ?? {}
          const getInteractionType = (contactId: string): InteractionType => {
            const contactData =
              contactInteractionMap instanceof Map
                ? contactInteractionMap.get(contactId)
                : contactInteractionMap[contactId]

            return contactData?.interaction ?? 'default'
          }

          searchedUsers = users
            .map((user) => transformUserToContact(user, getInteractionType(String(user._id))))
            .filter((user) => user.id !== userId && user.interactionType !== 'invite-hidden')
            .sort((a, b) => {
              if (a.interactionType === b.interactionType) return a.username.localeCompare(b.username)
              if (a.interactionType === 'invite-accepted') return 1
              if (b.interactionType === 'invite-accepted') return -1

              return a.username.localeCompare(b.username)
            })
        }

        const contacts = searchedUsers.slice(safeOffset, safeOffset + safeLimit)
        const hasMore = searchedUsers.length > safeOffset + safeLimit

        emitSearchedContacts(socket.id, {
          value: normalizedValue,
          offset: safeOffset,
          contacts,
          total: searchedUsers.length,
          hasMore,
          nextOffset: hasMore ? safeOffset + contacts.length : undefined
        })
      },
      { basicError: CONTACT_I18N.searchContactFailed }
    )
  )
}
