import { CONTACT_INTERACTION, type Contact, type Interaction, type UserData } from 'global-shared'

import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

import type { PresenceService } from '../../presence/presence.service'
import type { UserContact, UserSchema } from '../types'
import { UserModel } from '../user.model'

export const transformUserToPreview = (user: UserSchema) => {
  const userId = stringifyMongoId(user._id)

  return {
    avatarId: user.public.avatarId,
    id: userId,
    nickname: user.public.nickname
  }
}

export const mapUserToDto = (user: UserSchema): UserData => {
  return {
    ...transformUserToPreview(user),
    role: user.system.role,
    email: user.personal.email
  }
}

export const transformUserToContact = (
  user: UserSchema,
  interactionType: Interaction = CONTACT_INTERACTION.DEFAULT,
  online = false
): Contact => {
  return {
    ...transformUserToPreview(user),
    interactionType,
    online,
    lastSeen: user.public.lastSeen
  }
}

export const transformUserToFrontendContact = async (
  contacts: Record<string, UserContact>,
  presenceService: PresenceService
): Promise<Contact[]> => {
  const ids = Object.keys(contacts)
  const [users, onlineMap] = await Promise.all([
    UserModel.find({ _id: { $in: ids } }).lean<UserSchema[]>(),
    presenceService.onlineMapByUserIds(ids)
  ])

  return users.map((user) => {
    const userId = stringifyMongoId(user._id)
    const interactionType = contacts[userId]?.interaction ?? CONTACT_INTERACTION.DEFAULT

    return transformUserToContact(user, interactionType, onlineMap.get(userId) ?? false)
  })
}
