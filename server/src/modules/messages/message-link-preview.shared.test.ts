import {
  MESSAGE_LINK_PREVIEW_STATUS,
  buildPendingMessageLinkPreview,
  isHttpRedirectStatus,
  isHttpSuccessStatus
} from 'global-shared'
import { describe, expect, it } from 'vitest'

describe('message link preview shared helpers', () => {
  it('builds pending preview from the first valid https link', () => {
    const preview = buildPendingMessageLinkPreview('see https://example.com/path?q=1.')

    expect(preview).toEqual({
      url: 'https://example.com/path?q=1',
      host: 'example.com',
      status: MESSAGE_LINK_PREVIEW_STATUS.PENDING
    })
  })

  it('ignores non-https links', () => {
    expect(buildPendingMessageLinkPreview('http://example.com')).toBeNull()
    expect(buildPendingMessageLinkPreview('javascript:alert(1)')).toBeNull()
  })
})

describe('http status shared helpers', () => {
  it('detects success statuses', () => {
    expect(isHttpSuccessStatus(199)).toBe(false)
    expect(isHttpSuccessStatus(200)).toBe(true)
    expect(isHttpSuccessStatus(299)).toBe(true)
    expect(isHttpSuccessStatus(300)).toBe(false)
  })

  it('detects redirect statuses', () => {
    expect(isHttpRedirectStatus(299)).toBe(false)
    expect(isHttpRedirectStatus(300)).toBe(true)
    expect(isHttpRedirectStatus(399)).toBe(true)
    expect(isHttpRedirectStatus(400)).toBe(false)
  })
})
