import { ALLOWED_HOSTS } from '../config'

export const loadGoogleAvatar = async (avatar: string) => {
  try {
    const avatarUrl = new URL(avatar)
    if (ALLOWED_HOSTS.includes(avatarUrl.hostname)) {
      const response = await fetch(avatar)
      return Buffer.from(await response.arrayBuffer())
    }
  } catch {
    // non-critical
  }
}
