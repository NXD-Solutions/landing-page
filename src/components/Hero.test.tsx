import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders main heading', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Empower your managers.')
  })

  it('renders the value proposition', () => {
    render(<Hero />)
    expect(screen.getByText(/lead with clarity, confidence, and care/i)).toBeInTheDocument()
  })

  it('CTA links point to correct sections', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: 'Request early access' })).toHaveAttribute('href', '#early-access')
    expect(screen.getByRole('link', { name: 'See how it works' })).toHaveAttribute('href', '#how-it-works')
  })
})
