import type { NmorphFileCardMediaPreview } from '@nmorph/nmorph-ui-kit'

import { MESSAGE_ATTACHMENT_DRAFT_KIND } from '../config/constants'
import type { MessageAttachmentDraftListItem } from '../config/types'

export const resolveMessageAttachmentDraftMediaPreview = (
  attachment: MessageAttachmentDraftListItem
): NmorphFileCardMediaPreview => {
  if (attachment.kind === MESSAGE_ATTACHMENT_DRAFT_KIND.IMAGE) return 'image'
  if (attachment.kind === MESSAGE_ATTACHMENT_DRAFT_KIND.AUDIO) return 'audio'
  if (attachment.kind === MESSAGE_ATTACHMENT_DRAFT_KIND.VIDEO) return 'video'

  return 'none'
}
