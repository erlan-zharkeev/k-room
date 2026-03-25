import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { AppLink } from 'src/shared/ui/AppLink/AppLink'

describe('AppLink', () => {
  it('renders internal navigation through router link', () => {
    render(
      <MemoryRouter>
        <AppLink text="Privacy policy" to="/privacy-policy" />
      </MemoryRouter>
    )

    const link = screen.getByRole('link', { name: 'Privacy policy' })

    expect(link).toHaveAttribute('href', '/privacy-policy')
    expect(link).toHaveAttribute('target', '_self')
  })

  it('renders external link with blank target by default', () => {
    render(<AppLink text="Docs" href="https://example.com/docs" />)

    const link = screen.getByRole('link', { name: 'Docs' })

    expect(link).toHaveAttribute('href', 'https://example.com/docs')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })
})
