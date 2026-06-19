import {
  MESSAGE_LINK_CANDIDATE_PATTERN,
  MESSAGE_LINK_PROTOCOL,
  MESSAGE_LINK_TRAILING_PUNCTUATION_PATTERN
} from './constants'
import type { Message, MessageLinkPreview, MessageStatus } from './types'

const normalizeMessageLinkUrl = (candidate: string) => {
  const normalizedCandidate = candidate.replace(MESSAGE_LINK_TRAILING_PUNCTUATION_PATTERN, '')

  try {
    const url = new URL(normalizedCandidate)
    const isHttpsLink = url.protocol === MESSAGE_LINK_PROTOCOL
    const hasHostname = Boolean(url.hostname)

    if (!isHttpsLink || !hasHostname) return null

    return url
  } catch {
    return null
  }
}

export const buildPendingMessageLinkPreview = (body: string): MessageLinkPreview | null => {
  MESSAGE_LINK_CANDIDATE_PATTERN.lastIndex = 0
  const candidates = Array.from(body.matchAll(MESSAGE_LINK_CANDIDATE_PATTERN))

  for (const [candidate] of candidates) {
    const url = normalizeMessageLinkUrl(candidate)

    if (url) {
      return {
        url: url.href,
        host: url.hostname,
        status: 'pending'
      }
    }
  }

  return null
}

export const isMessageAuthor = (message: Pick<Message, 'authorId'>, userId: string) => message.authorId === userId

export const isMessageSendingStatus = (status?: MessageStatus) => status === 'sending'

export const isMessageStatusDelivered = (status?: MessageStatus) => status === 'delivered'

export const isMessageReadStatus = (status?: MessageStatus) => status === 'read'
