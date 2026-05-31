import type { MessageRecord } from 'src/shared/lib'
import { useI18n } from 'src/shared/lib'

import { CHAT_ROOMS_NAVIGATION_I18N } from '../config/i18n'

export const resolveLastMessageDescription = (lastMessage: MessageRecord | undefined) => {
  const { t } = useI18n()
  const imageMessageText = t(CHAT_ROOMS_NAVIGATION_I18N.imageMessage)
  const documentMessageText = t(CHAT_ROOMS_NAVIGATION_I18N.documentMessage)
  const audioMessageText = t(CHAT_ROOMS_NAVIGATION_I18N.audioMessage)
  const replyMessageText = t(CHAT_ROOMS_NAVIGATION_I18N.replyMessage)
  const forwardMessageText = t(CHAT_ROOMS_NAVIGATION_I18N.forwardMessage)

  if (!lastMessage) return ''

  const hasMessageBody = Boolean(lastMessage.body.trim())
  const hasMessageImages = Boolean(lastMessage.images?.length)
  const hasMessageDocuments = Boolean(lastMessage.documents?.length)
  const hasMessageAudios = Boolean(lastMessage.audios?.length)
  const { repliedMessage } = lastMessage

  if (hasMessageBody) return lastMessage.body
  if (hasMessageImages) return imageMessageText
  if (hasMessageDocuments) return documentMessageText
  if (hasMessageAudios) return audioMessageText
  if (repliedMessage) {
    const actionText = repliedMessage.forward ? forwardMessageText : replyMessageText
    const hasRepliedMessageBody = Boolean(repliedMessage.body.trim())
    const hasRepliedMessageImages = Boolean(repliedMessage.images?.length)
    const hasRepliedMessageDocuments = Boolean(repliedMessage.documents?.length)
    const hasRepliedMessageAudios = Boolean(repliedMessage.audios?.length)

    if (hasRepliedMessageBody) return `${actionText}: ${repliedMessage.body}`
    if (hasRepliedMessageImages) return `${actionText}: ${imageMessageText}`
    if (hasRepliedMessageDocuments) return `${actionText}: ${documentMessageText}`
    if (hasRepliedMessageAudios) return `${actionText}: ${audioMessageText}`

    return actionText
  }

  return ''
}
