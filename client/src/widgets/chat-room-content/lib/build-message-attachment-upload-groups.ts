import type { INmorphCustomFileData } from '@nmorph/nmorph-ui-kit'
import {
  MEDIA_AUDIO_UPLOAD_EXTENSIONS,
  MEDIA_DOCUMENT_UPLOAD_EXTENSIONS,
  MEDIA_KIND_ACCEPT_MAP,
  MEDIA_VIDEO_UPLOAD_EXTENSIONS,
  MESSAGE_ATTACHMENT_LIMIT
} from 'global-shared'

import {
  MESSAGE_AUDIO_MAX_FILE_SIZE,
  MESSAGE_DOCUMENT_MAX_FILE_SIZE,
  MESSAGE_IMAGE_MAX_FILE_SIZE,
  MESSAGE_VIDEO_MAX_FILE_SIZE
} from '../config/constants'
import type { MessageAttachmentUploadGroups } from '../config/types'

const resolveMessageUploadValueExtension = ({ data }: INmorphCustomFileData) => {
  const extension = data.name.split('.').pop()

  return extension?.toLowerCase() ?? ''
}
const hasMessageUploadExtension = (uploadValue: INmorphCustomFileData, extensions: readonly string[]) =>
  extensions.includes(resolveMessageUploadValueExtension(uploadValue))
const hasMessageUploadMimePrefix = ({ data }: INmorphCustomFileData, mimeMask: string) =>
  data.type.startsWith(mimeMask.replace('*', ''))
const isMessageAudioMimeType = (uploadValue: INmorphCustomFileData) =>
  hasMessageUploadMimePrefix(uploadValue, MEDIA_KIND_ACCEPT_MAP.audio)
const isMessageVideoMimeType = (uploadValue: INmorphCustomFileData) =>
  hasMessageUploadMimePrefix(uploadValue, MEDIA_KIND_ACCEPT_MAP.video)
const isMessageDocumentUploadValue = (uploadValue: INmorphCustomFileData) => {
  const hasPdfMimeType = uploadValue.data.type === MEDIA_KIND_ACCEPT_MAP.pdf
  const hasDocumentExtension = hasMessageUploadExtension(uploadValue, MEDIA_DOCUMENT_UPLOAD_EXTENSIONS)

  return hasPdfMimeType || hasDocumentExtension
}
const isMessageAudioUploadValue = (uploadValue: INmorphCustomFileData) => {
  const hasAudioMimeType = isMessageAudioMimeType(uploadValue)
  const hasAudioExtension = hasMessageUploadExtension(uploadValue, MEDIA_AUDIO_UPLOAD_EXTENSIONS)
  const hasVideoMimeType = isMessageVideoMimeType(uploadValue)
  const shouldUseAudioExtension = hasAudioExtension && !hasVideoMimeType

  return hasAudioMimeType || shouldUseAudioExtension
}
const isMessageVideoUploadValue = (uploadValue: INmorphCustomFileData) => {
  const hasVideoMimeType = isMessageVideoMimeType(uploadValue)
  const hasVideoExtension = hasMessageUploadExtension(uploadValue, MEDIA_VIDEO_UPLOAD_EXTENSIONS)
  const hasAudioUploadValue = isMessageAudioUploadValue(uploadValue)
  const shouldUseVideoExtension = hasVideoExtension && !hasAudioUploadValue

  return hasVideoMimeType || shouldUseVideoExtension
}

export const buildMessageAttachmentUploadGroups = (
  uploadValues: INmorphCustomFileData[]
): MessageAttachmentUploadGroups => {
  const sizeValidUploadValues: INmorphCustomFileData[] = []
  const sizeRejectedImageUploadValues: INmorphCustomFileData[] = []
  const sizeRejectedDocumentUploadValues: INmorphCustomFileData[] = []
  const sizeRejectedAudioUploadValues: INmorphCustomFileData[] = []
  const sizeRejectedVideoUploadValues: INmorphCustomFileData[] = []

  uploadValues.forEach((uploadValue) => {
    const isDocumentUploadValue = isMessageDocumentUploadValue(uploadValue)
    const isAudioUploadValue = isMessageAudioUploadValue(uploadValue)
    const isVideoUploadValue = isMessageVideoUploadValue(uploadValue)
    let maxFileSize = MESSAGE_IMAGE_MAX_FILE_SIZE

    if (isDocumentUploadValue) {
      maxFileSize = MESSAGE_DOCUMENT_MAX_FILE_SIZE
    } else if (isAudioUploadValue) {
      maxFileSize = MESSAGE_AUDIO_MAX_FILE_SIZE
    } else if (isVideoUploadValue) {
      maxFileSize = MESSAGE_VIDEO_MAX_FILE_SIZE
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

    if (isVideoUploadValue) {
      sizeRejectedVideoUploadValues.push(uploadValue)
      return
    }

    sizeRejectedImageUploadValues.push(uploadValue)
  })

  const validUploadValues = sizeValidUploadValues.slice(0, MESSAGE_ATTACHMENT_LIMIT)
  const limitRejectedUploadValues = sizeValidUploadValues.slice(MESSAGE_ATTACHMENT_LIMIT)
  const validAudioUploadValues = validUploadValues.filter(isMessageAudioUploadValue)
  const validVideoUploadValues = validUploadValues.filter(isMessageVideoUploadValue)
  const validDocumentUploadValues = validUploadValues.filter(isMessageDocumentUploadValue)
  const validImageUploadValues = validUploadValues.filter((uploadValue) => {
    const isDocumentUploadValue = isMessageDocumentUploadValue(uploadValue)
    const isAudioUploadValue = isMessageAudioUploadValue(uploadValue)
    const isVideoUploadValue = isMessageVideoUploadValue(uploadValue)
    const isImageUploadValue = ![isDocumentUploadValue, isAudioUploadValue, isVideoUploadValue].some(Boolean)

    return isImageUploadValue
  })

  return {
    validImageUploadValues,
    validDocumentUploadValues,
    validAudioUploadValues,
    validVideoUploadValues,
    sizeRejectedImageUploadValues,
    sizeRejectedDocumentUploadValues,
    sizeRejectedAudioUploadValues,
    sizeRejectedVideoUploadValues,
    limitRejectedUploadValues
  }
}
