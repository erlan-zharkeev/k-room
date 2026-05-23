import { MEDIA_AVATAR_FILENAME_PREFIX } from '../constants'

export const buildAvatarId = (id: string) => `${MEDIA_AVATAR_FILENAME_PREFIX}${id}`

export const isAvatarIdFor = (avatarId: string, id: string) => avatarId === buildAvatarId(id)
