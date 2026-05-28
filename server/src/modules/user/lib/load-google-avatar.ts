import { ALLOWED_GOOGLE_AVATAR_HOSTS } from '../user.constants'

export const loadGoogleAvatar = async (avatar: string) => {
  try {
    const avatarUrl = new URL(avatar)

    if (!ALLOWED_GOOGLE_AVATAR_HOSTS.includes(avatarUrl.hostname)) {
      return
    }

    const response = await fetch(avatar)

    return Buffer.from(await response.arrayBuffer())
  } catch {
    return undefined
  }
}
