import type { RepliedMessage } from 'global-shared'

export const resolveMessagePreviewText = ({
  body,
  documents,
  images
}: Pick<RepliedMessage, 'body' | 'documents' | 'images'>) => {
  if (body.trim()) return body

  return images?.[0]?.name || documents?.[0]?.name || ''
}
