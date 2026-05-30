import { MB_IN_BYTES, SECOND_IN_MS } from 'global-shared'

export const MESSAGE_LINK_PREVIEW_FETCH_TIMEOUT_MS = 5 * SECOND_IN_MS
export const MESSAGE_LINK_PREVIEW_FETCH_MAX_REDIRECTS = 3
export const MESSAGE_LINK_PREVIEW_HTML_MAX_BYTES = 128 * 1024
export const MESSAGE_LINK_PREVIEW_IMAGE_MAX_BYTES = 2 * MB_IN_BYTES
export const MESSAGE_LINK_PREVIEW_USER_AGENT = 'K-Room link preview bot'
export const MESSAGE_LINK_PREVIEW_ALLOWED_HTML_CONTENT_TYPES = ['text/html', 'application/xhtml+xml'] as const
export const MESSAGE_LINK_PREVIEW_PRIVATE_IPV4_CIDRS = [
  '0.0.0.0/8',
  '10.0.0.0/8',
  '100.64.0.0/10',
  '127.0.0.0/8',
  '169.254.0.0/16',
  '172.16.0.0/12',
  '192.0.0.0/24',
  '192.0.2.0/24',
  '192.168.0.0/16',
  '198.18.0.0/15',
  '198.51.100.0/24',
  '203.0.113.0/24',
  '224.0.0.0/4',
  '240.0.0.0/4'
] as const
export const MESSAGE_LINK_PREVIEW_PRIVATE_IPV6_EXACT_ADDRESSES = ['::', '::1'] as const
export const MESSAGE_LINK_PREVIEW_PRIVATE_IPV6_PREFIXES = ['fc', 'fd', 'fe8', 'fe9', 'fea', 'feb', 'ff'] as const
export const MESSAGE_LINK_PREVIEW_META_TAG_PATTERN = /<meta\s+[^>]*>/giu
export const MESSAGE_LINK_PREVIEW_ATTRIBUTE_PATTERN = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/giu
export const MESSAGE_LINK_PREVIEW_TITLE_TAG_PATTERN = /<title[^>]*>([\s\S]*?)<\/title>/iu
export const MESSAGE_LINK_PREVIEW_WHITESPACE_PATTERN = /\s+/gu
export const MESSAGE_LINK_PREVIEW_HTML_ENTITY_PATTERN = /&(#x[\da-f]+|#\d+|[a-z]+);/giu
export const MESSAGE_LINK_PREVIEW_HTML_ENTITY_MAP = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"'
} as const
export const MESSAGE_LINK_PREVIEW_TITLE_META_KEYS = ['og:title', 'twitter:title'] as const
export const MESSAGE_LINK_PREVIEW_DESCRIPTION_META_KEYS = [
  'og:description',
  'twitter:description',
  'description'
] as const
export const MESSAGE_LINK_PREVIEW_IMAGE_META_KEYS = ['og:image', 'twitter:image'] as const
