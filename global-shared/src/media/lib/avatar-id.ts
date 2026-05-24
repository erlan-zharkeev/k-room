import { MEDIA_AVATAR_FILENAME_PREFIX } from '../constants'
import type { MediaId } from '../types'

export const buildAvatarId = (id: string) => `${MEDIA_AVATAR_FILENAME_PREFIX}${id}`

export const isAvatarIdFor = (id: string, avatarId?: MediaId) => avatarId === buildAvatarId(id)
