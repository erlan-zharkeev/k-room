import type { Message } from 'global-shared'

import type { I18nTranslate } from 'src/shared/lib'

import { CHAT_ROOMS_NAVIGATION_I18N } from '../config/i18n'

export const resolveLastMessageDescription = (lastMessage: Message | undefined, t: I18nTranslate) => {
  const imageMessageText = t(CHAT_ROOMS_NAVIGATION_I18N.imageMessage)
  const documentMessageText = t(CHAT_ROOMS_NAVIGATION_I18N.documentMessage)
  const audioMessageText = t(CHAT_ROOMS_NAVIGATION_I18N.audioMessage)
  const videoMessageText = t(CHAT_ROOMS_NAVIGATION_I18N.videoMessage)
  const replyMessageText = t(CHAT_ROOMS_NAVIGATION_I18N.replyMessage)
  const forwardMessageText = t(CHAT_ROOMS_NAVIGATION_I18N.forwardMessage)

  if (!lastMessage) return ''

  const hasMessageBody = Boolean(lastMessage.body.trim())
  const hasMessageImages = Boolean(lastMessage.images?.length)
  const hasMessageDocuments = Boolean(lastMessage.documents?.length)
  const hasMessageAudios = Boolean(lastMessage.audios?.length)
  const hasMessageVideos = Boolean(lastMessage.videos?.length)
  const { repliedMessage } = lastMessage

  if (hasMessageBody) return lastMessage.body
  if (hasMessageImages) return imageMessageText
  if (hasMessageDocuments) return documentMessageText
  if (hasMessageAudios) return audioMessageText
  if (hasMessageVideos) return videoMessageText
  if (repliedMessage) {
    const actionText = repliedMessage.forward ? forwardMessageText : replyMessageText
    const hasRepliedMessageBody = Boolean(repliedMessage.body.trim())
    const hasRepliedMessageImages = Boolean(repliedMessage.images?.length)
    const hasRepliedMessageDocuments = Boolean(repliedMessage.documents?.length)
    const hasRepliedMessageAudios = Boolean(repliedMessage.audios?.length)
    const hasRepliedMessageVideos = Boolean(repliedMessage.videos?.length)

    if (hasRepliedMessageBody) return `${actionText}: ${repliedMessage.body}`
    if (hasRepliedMessageImages) return `${actionText}: ${imageMessageText}`
    if (hasRepliedMessageDocuments) return `${actionText}: ${documentMessageText}`
    if (hasRepliedMessageAudios) return `${actionText}: ${audioMessageText}`
    if (hasRepliedMessageVideos) return `${actionText}: ${videoMessageText}`

    return actionText
  }

  return ''
}
