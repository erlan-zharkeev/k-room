import { describe, expect, it } from 'vitest'

import { buildMessageTextSegments } from './build-message-text-segments'

describe('buildMessageTextSegments', () => {
  it('splits text into plain and https link segments', () => {
    expect(buildMessageTextSegments('open https://example.com/page now')).toEqual([
      { id: 'text-0', kind: 'text', text: 'open ' },
      {
        id: 'link-1',
        kind: 'link',
        text: 'https://example.com/page',
        href: 'https://example.com/page'
      },
      { id: 'text-2', kind: 'text', text: ' now' }
    ])
  })

  it('keeps trailing punctuation outside the link', () => {
    expect(buildMessageTextSegments('see https://example.com/path, please')[1]).toEqual({
      id: 'link-1',
      kind: 'link',
      text: 'https://example.com/path',
      href: 'https://example.com/path'
    })
    expect(buildMessageTextSegments('see https://example.com/path, please')[2]).toEqual({
      id: 'text-2',
      kind: 'text',
      text: ','
    })
  })

  it('does not convert http or javascript text into links', () => {
    expect(buildMessageTextSegments('http://example.com javascript:alert(1)')).toEqual([
      {
        id: 'text-0',
        kind: 'text',
        text: 'http://example.com javascript:alert(1)'
      }
    ])
  })
})
