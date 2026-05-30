import { MESSAGE_LINK_PREVIEW_STATUS, type MessageLinkPreview } from 'global-shared'
import { describe, expect, it } from 'vitest'

import {
  canShowMessageLinkPreview,
  resolveMessageLinkPreviewTitle
} from '../src/widgets/chat-room-content/lib/message-link-preview'

const createPreview = (patch: Partial<MessageLinkPreview> = {}): MessageLinkPreview => ({
  url: 'https://example.com/',
  host: 'example.com',
  status: MESSAGE_LINK_PREVIEW_STATUS.LOADED,
  title: 'Example title',
  ...patch
})

describe('message link preview client helpers', () => {
  it('shows only loaded https previews with content', () => {
    expect(canShowMessageLinkPreview(createPreview())).toBe(true)
    expect(canShowMessageLinkPreview(createPreview({ status: MESSAGE_LINK_PREVIEW_STATUS.PENDING }))).toBe(false)
    expect(canShowMessageLinkPreview(createPreview({ status: MESSAGE_LINK_PREVIEW_STATUS.FAILED }))).toBe(false)
    expect(canShowMessageLinkPreview(createPreview({ url: 'http://example.com/' }))).toBe(false)
    expect(canShowMessageLinkPreview(createPreview({ title: '', description: '', image: undefined }))).toBe(false)
  })

  it('falls back to host when title is missing', () => {
    expect(resolveMessageLinkPreviewTitle(createPreview({ title: '' }))).toBe('example.com')
  })
})
