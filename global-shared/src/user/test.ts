import { describe, expect, it } from 'vitest'

import { isNicknameValid, normalizeNicknameKey } from '../index'

describe('user contracts', () => {
  it('normalizes and validates nicknames predictably', () => {
    expect(normalizeNicknameKey(' Tester ')).toBe('tester')
    expect(isNicknameValid('tester-1')).toBe(true)
    expect(isNicknameValid('Tester 1')).toBe(false)
  })
})
