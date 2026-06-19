import {
  MESSAGE_LINK_CANDIDATE_PATTERN,
  MESSAGE_LINK_PROTOCOL,
  MESSAGE_LINK_TRAILING_PUNCTUATION_PATTERN
} from 'global-shared'

import type { MessageTextSegment } from '../config/types'

const createMessageTextSegmentId = (kind: string, index: number) => `${kind}-${index}`

const createMessageTextPlainSegment = (text: string, index: number): MessageTextSegment => ({
  id: createMessageTextSegmentId('text', index),
  kind: 'text',
  text
})

const createMessageTextLinkSegment = (text: string, href: string, index: number): MessageTextSegment => ({
  id: createMessageTextSegmentId('link', index),
  kind: 'link',
  text,
  href
})

const resolveMessageTextLink = (candidate: string) => {
  const text = candidate.replace(MESSAGE_LINK_TRAILING_PUNCTUATION_PATTERN, '')

  try {
    const url = new URL(text)
    const isHttpsLink = url.protocol === MESSAGE_LINK_PROTOCOL
    const hasHostname = Boolean(url.hostname)

    if (!isHttpsLink || !hasHostname) return null

    return {
      href: url.href,
      text
    }
  } catch {
    return null
  }
}

const appendMessageTextPlainSegment = (segments: MessageTextSegment[], text: string, index: number) => {
  if (!text) return index

  segments.push(createMessageTextPlainSegment(text, index))

  return index + 1
}

export const buildMessageTextSegments = (text: string) => {
  const segments: MessageTextSegment[] = []
  let cursor = 0
  let segmentIndex = 0

  MESSAGE_LINK_CANDIDATE_PATTERN.lastIndex = 0

  for (const match of text.matchAll(MESSAGE_LINK_CANDIDATE_PATTERN)) {
    const matchIndex = match.index

    if (matchIndex === undefined) continue

    const candidate = match[0]
    const link = resolveMessageTextLink(candidate)
    const previousText = text.slice(cursor, matchIndex)

    segmentIndex = appendMessageTextPlainSegment(segments, previousText, segmentIndex)

    if (link) {
      const trailingText = candidate.slice(link.text.length)

      segments.push(createMessageTextLinkSegment(link.text, link.href, segmentIndex))
      segmentIndex += 1
      segmentIndex = appendMessageTextPlainSegment(segments, trailingText, segmentIndex)
    } else {
      segmentIndex = appendMessageTextPlainSegment(segments, candidate, segmentIndex)
    }

    cursor = matchIndex + candidate.length
  }

  appendMessageTextPlainSegment(segments, text.slice(cursor), segmentIndex)

  return segments
}
