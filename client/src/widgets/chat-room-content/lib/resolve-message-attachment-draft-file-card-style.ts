import { MESSAGE_ATTACHMENT_FILE_WIDTH_PX, MESSAGE_ATTACHMENT_VISUAL_FILE_CARD_WIDTH_PX } from '../config/constants'
import type { MessageAttachmentDraftListItem } from '../config/types'

const isMessageAttachmentDraftVisual = (attachment: MessageAttachmentDraftListItem) => {
  return attachment.kind === 'image' || attachment.kind === 'video'
}

export const resolveMessageAttachmentDraftFileCardStyle = (attachment: MessageAttachmentDraftListItem) => {
  if (!isMessageAttachmentDraftVisual(attachment)) {
    return {
      width: `${MESSAGE_ATTACHMENT_FILE_WIDTH_PX}px`
    }
  }

  return {
    width: `${MESSAGE_ATTACHMENT_VISUAL_FILE_CARD_WIDTH_PX}px`
  }
}
