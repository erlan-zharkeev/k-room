import type { NmorphFileCardMediaPreview } from '@nmorph/nmorph-ui-kit'

import type { MessageAttachmentDraftListItem } from '../config/types'

export const resolveMessageAttachmentDraftMediaPreview = (
  attachment: MessageAttachmentDraftListItem
): NmorphFileCardMediaPreview => {
  if (attachment.kind === 'image') return 'image'
  if (attachment.kind === 'audio') return 'audio'
  if (attachment.kind === 'video') return 'video'

  return 'none'
}
