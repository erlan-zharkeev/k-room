import { MESSAGE_LINK_PREVIEW_STATUS, type MessageLinkPreview } from 'global-shared'

import { log } from 'src/shared/lib/log'

import { deleteBucketFileById } from '../../media/media.service'
import { MessageModel } from '../messages.model'

import { loadMessageLinkPreview } from './load-message-link-preview'

const updateMessageLinkPreview = async (messageId: string, linkPreview: MessageLinkPreview | null) => {
  if (!linkPreview) return

  const loadedLinkPreview = await loadMessageLinkPreview(linkPreview)
  const uploadedImageId = loadedLinkPreview.image?.src

  try {
    const updateResult = await MessageModel.updateOne(
      {
        _id: messageId,
        'linkPreview.url': linkPreview.url,
        'linkPreview.status': MESSAGE_LINK_PREVIEW_STATUS.PENDING
      },
      { $set: { linkPreview: loadedLinkPreview } }
    )
    const shouldDeleteUnusedImage = updateResult.modifiedCount <= 0 && Boolean(uploadedImageId)

    if (shouldDeleteUnusedImage && uploadedImageId) {
      await deleteBucketFileById('image', uploadedImageId)
    }
  } catch (error) {
    if (uploadedImageId) {
      await deleteBucketFileById('image', uploadedImageId)
    }

    throw error
  }
}

export const refreshMessageLinkPreview = (messageId: string, linkPreview: MessageLinkPreview | null) => {
  void updateMessageLinkPreview(messageId, linkPreview).catch((error) => {
    log.error(`-Message link preview update failed: ${error instanceof Error ? error.message : String(error)}`)
  })
}
