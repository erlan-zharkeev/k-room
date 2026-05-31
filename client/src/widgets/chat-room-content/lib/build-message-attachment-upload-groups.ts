import type { INmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import { MEDIA_KIND_ACCEPT_MAP, MESSAGE_ATTACHMENT_LIMIT } from 'global-shared'

import {
  MESSAGE_AUDIO_MAX_FILE_SIZE,
  MESSAGE_DOCUMENT_MAX_FILE_SIZE,
  MESSAGE_IMAGE_MAX_FILE_SIZE
} from '../config/constants'
import type { MessageAttachmentUploadGroups } from '../config/types'

const isMessageDocumentUploadValue = ({ data }: INmorphCustomFileData) => data.type === MEDIA_KIND_ACCEPT_MAP.pdf
const isMessageAudioUploadValue = ({ data }: INmorphCustomFileData) =>
  data.type.startsWith(MEDIA_KIND_ACCEPT_MAP.audio.replace('*', ''))

export const buildMessageAttachmentUploadGroups = (
  uploadValues: INmorphCustomFileData[]
): MessageAttachmentUploadGroups => {
  const sizeValidUploadValues: INmorphCustomFileData[] = []
  const sizeRejectedImageUploadValues: INmorphCustomFileData[] = []
  const sizeRejectedDocumentUploadValues: INmorphCustomFileData[] = []
  const sizeRejectedAudioUploadValues: INmorphCustomFileData[] = []

  uploadValues.forEach((uploadValue) => {
    const isDocumentUploadValue = isMessageDocumentUploadValue(uploadValue)
    const isAudioUploadValue = isMessageAudioUploadValue(uploadValue)
    let maxFileSize = MESSAGE_IMAGE_MAX_FILE_SIZE

    if (isDocumentUploadValue) {
      maxFileSize = MESSAGE_DOCUMENT_MAX_FILE_SIZE
    } else if (isAudioUploadValue) {
      maxFileSize = MESSAGE_AUDIO_MAX_FILE_SIZE
    }

    const isSizeValid = uploadValue.data.size <= maxFileSize

    if (isSizeValid) {
      sizeValidUploadValues.push(uploadValue)
      return
    }

    if (isDocumentUploadValue) {
      sizeRejectedDocumentUploadValues.push(uploadValue)
      return
    }

    if (isAudioUploadValue) {
      sizeRejectedAudioUploadValues.push(uploadValue)
      return
    }

    sizeRejectedImageUploadValues.push(uploadValue)
  })

  const validUploadValues = sizeValidUploadValues.slice(0, MESSAGE_ATTACHMENT_LIMIT)
  const limitRejectedUploadValues = sizeValidUploadValues.slice(MESSAGE_ATTACHMENT_LIMIT)
  const validAudioUploadValues = validUploadValues.filter(isMessageAudioUploadValue)
  const validDocumentUploadValues = validUploadValues.filter(isMessageDocumentUploadValue)
  const validImageUploadValues = validUploadValues.filter((uploadValue) => {
    const isDocumentUploadValue = isMessageDocumentUploadValue(uploadValue)
    const isAudioUploadValue = isMessageAudioUploadValue(uploadValue)

    return !isDocumentUploadValue && !isAudioUploadValue
  })

  return {
    validImageUploadValues,
    validDocumentUploadValues,
    validAudioUploadValues,
    sizeRejectedImageUploadValues,
    sizeRejectedDocumentUploadValues,
    sizeRejectedAudioUploadValues,
    limitRejectedUploadValues
  }
}
