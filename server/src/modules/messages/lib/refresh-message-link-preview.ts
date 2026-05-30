import { MESSAGE_LINK_PREVIEW_STATUS } from 'global-shared'

import { log } from 'src/shared/lib/log'

import { deleteBucketFileById } from '../../media/media.service'
import { emitToUsers } from '../../presence/presence.utils'
import { MessageModel } from '../messages.model'
import type { RefreshMessageLinkPreviewParams } from '../messages.types'

import { loadMessageLinkPreview } from './load-message-link-preview'

const updateMessageLinkPreview = async ({
  linkPreview,
  messageId,
  roomId,
  userIds
}: RefreshMessageLinkPreviewParams) => {
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

    if (updateResult.modifiedCount > 0) {
      emitToUsers(userIds, 'message-link-preview-updated', {
        roomId,
        messageId,
        linkPreview: loadedLinkPreview
      })
    }
  } catch (error) {
    if (uploadedImageId) {
      await deleteBucketFileById('image', uploadedImageId)
    }

    throw error
  }
}

export const refreshMessageLinkPreview = (params: RefreshMessageLinkPreviewParams) => {
  void updateMessageLinkPreview(params).catch((error) => {
    log.error(`-Message link preview update failed: ${error instanceof Error ? error.message : String(error)}`)
  })
}
