import {
  USER_DEFAULT_ONBOARDING,
  type Contact,
  type Interaction,
  type UserData,
  type UserOnboardingData
} from 'global-shared'

import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

import type { PresenceService } from '../../presence/presence.service'
import { UserModel } from '../user.model'
import type { UserContact, UserSchema } from '../user.types'

export const transformUserToPreview = (user: UserSchema) => {
  const userId = stringifyMongoId(user._id)

  return {
    avatarId: user.public.avatarId,
    id: userId,
    nickname: user.public.nickname
  }
}

const mapUserOnboardingToDto = (onboarding: UserOnboardingData = USER_DEFAULT_ONBOARDING): UserOnboardingData => {
  return {
    welcomeCompleted: onboarding.welcomeCompleted,
    guideCompleted: onboarding.guideCompleted
  }
}

export const mapUserToDto = (user: UserSchema): UserData => {
  return {
    ...transformUserToPreview(user),
    role: user.system.role,
    email: user.personal.email,
    provider: user.system.provider ?? 'app',
    onboarding: mapUserOnboardingToDto(user.personal.onboarding)
  }
}

export const transformUserToContact = (
  user: UserSchema,
  interactionType: Interaction = 'default',
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
    const interactionType = contacts[userId]?.interaction ?? 'default'

    return transformUserToContact(user, interactionType, onlineMap.get(userId) ?? false)
  })
}
