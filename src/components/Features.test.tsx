import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Features } from './Features'

describe('Features', () => {
  it('renders section heading', () => {
    render(<Features />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent("Everything a manager needs. Nothing they don't.")
  })

  it('renders all six feature cards', () => {
    render(<Features />)
    expect(screen.getByText('AI-Powered Coaching')).toBeInTheDocument()
    expect(screen.getByText('Real-Time Team Insights')).toBeInTheDocument()
    expect(screen.getByText('Structured Action Plans')).toBeInTheDocument()
    expect(screen.getByText('Seamless Integrations')).toBeInTheDocument()
    expect(screen.getByText('1:1 Preparation')).toBeInTheDocument()
    expect(screen.getByText('Built for Enterprise')).toBeInTheDocument()
  })
})
