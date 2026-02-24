import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HowItWorks } from './HowItWorks'

describe('HowItWorks', () => {
  it('renders section heading', () => {
    render(<HowItWorks />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('How it works')
  })

  it('renders all three steps', () => {
    render(<HowItWorks />)
    expect(screen.getByText('Connect your team')).toBeInTheDocument()
    expect(screen.getByText('Get personalised insights')).toBeInTheDocument()
    expect(screen.getByText('Act with confidence')).toBeInTheDocument()
  })

  it('renders step numbers in order', () => {
    render(<HowItWorks />)
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()
  })
})
