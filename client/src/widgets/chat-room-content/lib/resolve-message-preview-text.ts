import type { RepliedMessage } from 'global-shared'

export const resolveMessagePreviewText = ({
  audios,
  body,
  documents,
  images,
  videos
}: Pick<RepliedMessage, 'audios' | 'body' | 'documents' | 'images' | 'videos'>) => {
  if (body.trim()) return body

  return images?.[0]?.name || documents?.[0]?.name || audios?.[0]?.name || videos?.[0]?.name || ''
}
