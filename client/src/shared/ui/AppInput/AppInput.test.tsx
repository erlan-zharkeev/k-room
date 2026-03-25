import type { ChangeEvent } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { AppInput } from 'src/shared/ui/AppInput/AppInput'

describe('AppInput', () => {
  it('toggles password visibility', async () => {
    const user = userEvent.setup()

    const { container } = render(<AppInput name="password" nativeType="password" placeholder="Password" value="" />)
    const input = screen.getByPlaceholderText('Password')
    const toggleButton = container.querySelector('.app-input__show-pass-btn button')

    expect(input).toHaveAttribute('type', 'password')
    expect(toggleButton).not.toBeNull()

    await user.click(toggleButton as HTMLButtonElement)

    expect(input).toHaveAttribute('type', 'text')
  })

  it('clears the input value through synthetic change event', () => {
    const onChange = vi.fn()
    const { container } = render(
      <AppInput name="email" placeholder="Email" value="erlan@gmail.com" onChange={onChange} showClearButton />
    )

    const clearButton = container.querySelector('.app-input__suffix-slot button')
    expect(clearButton).not.toBeNull()

    fireEvent.click(clearButton as HTMLButtonElement)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect((onChange.mock.calls[0][0] as ChangeEvent<HTMLInputElement>).target.name).toBe('email')
    expect((onChange.mock.calls[0][0] as ChangeEvent<HTMLInputElement>).target.value).toBe('')
  })
})
