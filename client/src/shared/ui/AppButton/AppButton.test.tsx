import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AppButton } from 'src/shared/ui'

describe('AppButton', () => {
  it('calls click handler when enabled', () => {
    const onClick = vi.fn()

    render(<AppButton text="Submit" onClick={onClick} />)

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('stays disabled when disabled prop is passed', () => {
    render(<AppButton text="Submit" disabled />)

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
  })
})
