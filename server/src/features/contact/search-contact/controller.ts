import { FrontendContactType, IEventSearchContact, SocketActionsType } from 'common-types'
import { UserModel } from 'entities/user'
import { transformUserToContact } from 'features/user/~shared/lib/transform-user-to-frontend-contact'
import { Types } from 'mongoose'
import { SocketInstanceType } from 'shared-config'

import { emitSearchedContacts } from './emitter'

export const controller = (socket: SocketInstanceType) => {

  socket.on<SocketActionsType>('search-contact', async ({ value }: IEventSearchContact) => {
    let type: 'name' | 'id' = 'name'
    let validSearch = true
    let needle = value?.trim() || ''

    if (!needle) validSearch = false

    // Id pattern search "#<id>"
    if (needle.includes('#')) {
      needle = needle.substring(1)
      type = Types.ObjectId.isValid(needle) ? 'id' : 'name'
      if (type === 'name' && !needle) validSearch = false
    }

    const $regex = new RegExp(needle, 'i')

    const searchTypeMap: Record<
      typeof type,
      | { 'public.username': { $regex: RegExp } }
      | { 'public.email': { $regex: RegExp } }
      | { _id: string }
    > = {
      name: { 'public.username': { $regex } },
      id: { _id: needle }
    }

    const searchFilter = validSearch ? searchTypeMap[type] : null

    let searchedUsers: FrontendContactType[] = []

    if (searchFilter) {
      const users = await UserModel.find(searchFilter)
      const { userId } = socket.data
      searchedUsers = users.map((user) => transformUserToContact(user)).filter((user) => user.id !== userId)
    }

    emitSearchedContacts(socket.id, searchedUsers)
  })
}