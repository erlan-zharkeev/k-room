import { MediaType } from 'common-types'

export const getMediaType = (file?: { mimetype?: string; contentType?: string }): MediaType => {
  if (!file) return 'unknown'

  const type = (file.mimetype || file.contentType || '').toLowerCase()
  if (!type.includes('/')) return 'unknown'

  const [main, sub] = type.split('/')

  switch (main) {
    case 'image':
      return 'image'
    case 'video':
      return 'video'
    case 'audio':
      return 'audio'
    case 'application':
      return sub === 'pdf' ? 'pdf' : 'unknown'
    default:
      return 'unknown'
  }
}
