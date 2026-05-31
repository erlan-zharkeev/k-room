import type { INmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import { MEDIA_KIND_ACCEPT_MAP, MESSAGE_ATTACHMENT_LIMIT } from 'global-shared'

import { MESSAGE_DOCUMENT_MAX_FILE_SIZE, MESSAGE_IMAGE_MAX_FILE_SIZE } from '../config/constants'
import type { MessageAttachmentUploadGroups } from '../config/types'

const isMessageDocumentUploadValue = ({ data }: INmorphCustomFileData) => data.type === MEDIA_KIND_ACCEPT_MAP.pdf

export const buildMessageAttachmentUploadGroups = (
  uploadValues: INmorphCustomFileData[]
): MessageAttachmentUploadGroups => {
  const sizeValidUploadValues: INmorphCustomFileData[] = []
  const sizeRejectedImageUploadValues: INmorphCustomFileData[] = []
  const sizeRejectedDocumentUploadValues: INmorphCustomFileData[] = []

  uploadValues.forEach((uploadValue) => {
    const isDocumentUploadValue = isMessageDocumentUploadValue(uploadValue)
    const maxFileSize = isDocumentUploadValue ? MESSAGE_DOCUMENT_MAX_FILE_SIZE : MESSAGE_IMAGE_MAX_FILE_SIZE
    const isSizeValid = uploadValue.data.size <= maxFileSize

    if (isSizeValid) {
      sizeValidUploadValues.push(uploadValue)
      return
    }

    if (isDocumentUploadValue) {
      sizeRejectedDocumentUploadValues.push(uploadValue)
      return
    }

    sizeRejectedImageUploadValues.push(uploadValue)
  })

  const validUploadValues = sizeValidUploadValues.slice(0, MESSAGE_ATTACHMENT_LIMIT)
  const limitRejectedUploadValues = sizeValidUploadValues.slice(MESSAGE_ATTACHMENT_LIMIT)
  const validImageUploadValues = validUploadValues.filter((uploadValue) => !isMessageDocumentUploadValue(uploadValue))
  const validDocumentUploadValues = validUploadValues.filter(isMessageDocumentUploadValue)

  return {
    validImageUploadValues,
    validDocumentUploadValues,
    sizeRejectedImageUploadValues,
    sizeRejectedDocumentUploadValues,
    limitRejectedUploadValues
  }
}
