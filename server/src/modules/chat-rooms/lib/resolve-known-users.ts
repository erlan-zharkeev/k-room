import type { KnownUser } from 'global-shared'

import type { PresenceService } from 'src/modules/presence/presence.service'
import { loadUsersPublicByIds } from 'src/modules/user/lib/user-persistence'
import { stringifyMongoId } from 'src/shared/lib/normalize-object-id'

export const resolveKnownUsers = async (userIds: string[], presenceService: PresenceService): Promise<KnownUser[]> => {
  if (!userIds.length) return []

  const [users, onlineMap] = await Promise.all([
    loadUsersPublicByIds(userIds),
    presenceService.onlineMapByUserIds(userIds)
  ])
  const userById = new Map(users.map((user) => [stringifyMongoId(user._id), user]))

  const knownUsers = userIds.map((id) => {
    const user = userById.get(id)

    if (!user) return null

    return {
      avatarId: user.public.avatarId,
      id,
      nickname: user.public.nickname,
      online: onlineMap.get(id) ?? false,
      lastSeen: user.public.lastSeen
    } satisfies KnownUser
  })

  return knownUsers.filter((user): user is KnownUser => Boolean(user))
}
