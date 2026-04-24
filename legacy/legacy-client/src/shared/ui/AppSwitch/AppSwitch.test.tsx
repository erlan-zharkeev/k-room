import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { AppSwitch } from 'src/shared/ui/AppSwitch/AppSwitch'

describe('AppSwitch', () => {
  it('toggles checked state text and calls change handler', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<AppSwitch name="policy" value={false} offText="Unread" onText="Read" onChange={onChange} />)

    expect(screen.getByText('Unread')).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox'))

    expect(screen.getByText('Read')).toBeInTheDocument()
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('stays disabled when disabled prop is passed', () => {
    render(<AppSwitch name="policy" value={false} disabled />)

    expect(screen.getByRole('checkbox')).toBeDisabled()
  })
})
