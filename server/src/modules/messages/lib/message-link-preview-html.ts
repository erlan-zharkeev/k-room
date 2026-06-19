import {
  MESSAGE_LINK_PREVIEW_ATTRIBUTE_PATTERN,
  MESSAGE_LINK_PREVIEW_HTML_ENTITY_MAP,
  MESSAGE_LINK_PREVIEW_HTML_ENTITY_PATTERN,
  MESSAGE_LINK_PREVIEW_META_TAG_PATTERN,
  MESSAGE_LINK_PREVIEW_TITLE_TAG_PATTERN,
  MESSAGE_LINK_PREVIEW_WHITESPACE_PATTERN
} from '../messages.constants'

const decodeMessageLinkPreviewText = (value: string) =>
  value
    .replace(MESSAGE_LINK_PREVIEW_HTML_ENTITY_PATTERN, (_entity, entity: string) => {
      const normalizedEntity = entity.toLowerCase()

      if (normalizedEntity.startsWith('#x')) {
        return String.fromCodePoint(Number.parseInt(normalizedEntity.slice(2), 16))
      }

      if (normalizedEntity.startsWith('#')) {
        return String.fromCodePoint(Number.parseInt(normalizedEntity.slice(1), 10))
      }

      return (
        MESSAGE_LINK_PREVIEW_HTML_ENTITY_MAP[normalizedEntity as keyof typeof MESSAGE_LINK_PREVIEW_HTML_ENTITY_MAP] ??
        ''
      )
    })
    .replace(MESSAGE_LINK_PREVIEW_WHITESPACE_PATTERN, ' ')
    .trim()

const readMetaTagAttributes = (tag: string) => {
  const attributes = new Map<string, string>()

  for (const match of tag.matchAll(MESSAGE_LINK_PREVIEW_ATTRIBUTE_PATTERN)) {
    const [, rawName, doubleQuotedValue, singleQuotedValue, unquotedValue] = match
    const value = doubleQuotedValue ?? singleQuotedValue ?? unquotedValue

    if (!rawName || !value) continue

    attributes.set(rawName.toLowerCase(), decodeMessageLinkPreviewText(value))
  }

  return attributes
}

export const readMessageLinkPreviewMetaValueByKeys = (html: string, keys: readonly string[]) => {
  for (const match of html.matchAll(MESSAGE_LINK_PREVIEW_META_TAG_PATTERN)) {
    const [tag] = match
    const attributes = readMetaTagAttributes(tag)
    const key = attributes.get('property') ?? attributes.get('name')
    const content = attributes.get('content')
    const hasMatchedKey = key && keys.includes(key.toLowerCase())

    if (hasMatchedKey && content) return content
  }

  return ''
}

export const readMessageLinkPreviewTitleTagValue = (html: string) => {
  const title = html.match(MESSAGE_LINK_PREVIEW_TITLE_TAG_PATTERN)?.[1]

  return title ? decodeMessageLinkPreviewText(title) : ''
}
