import { describe, expect, it } from 'vitest'

import { createClassNameWithModifiers } from './create-class-name-with-modifiers'

describe('createClassNameWithModifiers', () => {
  it('builds root class with valid modifiers and extra class name', () => {
    expect(
      createClassNameWithModifiers({
        rootClass: 'app-button',
        modifiers: ['primary', false, undefined, 'disabled'],
        additionalClassName: 'custom'
      })
    ).toBe('app-button app-button--primary app-button--disabled custom')
  })

  it('returns only root class when no valid modifiers are passed', () => {
    expect(
      createClassNameWithModifiers({
        rootClass: 'app-link',
        modifiers: [false, undefined]
      })
    ).toBe('app-link')
  })
})
