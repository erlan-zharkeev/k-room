import { describe, expect, it } from 'vitest'

import { isAcceptedContactInteraction, isInviteReceivedContactInteraction } from '../index'

describe('contact contracts', () => {
  it('keeps interaction helpers aligned with interaction constants', () => {
    expect(isAcceptedContactInteraction('invite-accepted')).toBe(true)
    expect(isInviteReceivedContactInteraction('invite-received')).toBe(true)
    expect(isAcceptedContactInteraction('invited')).toBe(false)
  })
})
