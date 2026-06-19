import { computed } from 'vue'

import { useLiveMediaUrlMap } from 'src/shared/lib'

import type { MessageAttachmentDraftListItem, MessageAttachmentDraftListProps } from '../config/types'

export const useMessageAttachmentDraftList = (props: MessageAttachmentDraftListProps) => {
  const attachmentMediaIds = computed(() => props.attachments.map(({ src }) => src))
  const mediaUrlById = useLiveMediaUrlMap(() => attachmentMediaIds.value)

  const resolveAttachmentPreviewSrc = (attachment: MessageAttachmentDraftListItem) => {
    return mediaUrlById.value.get(attachment.src)
  }

  const openAttachmentPreview = (attachment: MessageAttachmentDraftListItem, previewSrc?: string) => {
    if (attachment.kind === 'image') return
    if (!previewSrc) return

    window.open(previewSrc, '_blank', 'noopener,noreferrer')
  }

  return {
    openAttachmentPreview,
    resolveAttachmentPreviewSrc
  }
}
