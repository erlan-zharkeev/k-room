import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { AppForm } from 'src/shared/ui'

describe('AppForm', () => {
  it('enables submit only after valid data and submits collected form payload', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <AppForm
        submitBtnText="Login"
        onSubmit={onSubmit}
        fields={{
          email: {
            inputType: 'text',
            placeholder: 'Email',
            rule: { name: 'email' },
            autoComplete: 'off'
          },
          password: {
            inputType: 'text',
            nativeType: 'password',
            placeholder: 'Password',
            rule: { name: 'password' },
            autoComplete: 'off'
          }
        }}
      />
    )

    const submitButton = screen.getByRole('button', { name: 'Login' })
    expect(submitButton).toBeDisabled()

    await user.type(screen.getByPlaceholderText('Email'), 'erlan@gmail.com')
    expect(submitButton).toBeDisabled()

    await user.type(screen.getByPlaceholderText('Password'), 'Asdf1234')
    expect(submitButton).toBeEnabled()

    await user.click(submitButton)

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'erlan@gmail.com',
      password: 'Asdf1234'
    })
  })
})
