import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders brand name', () => {
    render(<Footer />)
    expect(screen.getByText('NXD')).toBeInTheDocument()
    expect(screen.getByText('Manager Hub')).toBeInTheDocument()
  })

  it('navigation links point to correct sections', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Features' })).toHaveAttribute('href', '#features')
    expect(screen.getByRole('link', { name: 'How it works' })).toHaveAttribute('href', '#how-it-works')
    expect(screen.getByRole('link', { name: 'Early access' })).toHaveAttribute('href', '#early-access')
  })

  it('renders copyright with the current year', () => {
    render(<Footer />)
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument()
  })
})
