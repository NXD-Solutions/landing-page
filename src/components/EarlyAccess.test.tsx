import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EarlyAccess } from './EarlyAccess'

describe('EarlyAccess', () => {
  it('renders the sign-up form by default', () => {
    render(<EarlyAccess />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Request access' })).toBeInTheDocument()
  })

  it('shows confirmation after submitting a valid email', async () => {
    const user = userEvent.setup()
    render(<EarlyAccess />)

    await user.type(screen.getByRole('textbox'), 'test@company.com')
    await user.click(screen.getByRole('button', { name: 'Request access' }))

    expect(screen.getByText("You're on the list.")).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('does not show confirmation when email is empty', async () => {
    const user = userEvent.setup()
    render(<EarlyAccess />)

    await user.click(screen.getByRole('button', { name: 'Request access' }))

    expect(screen.queryByText("You're on the list.")).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})
