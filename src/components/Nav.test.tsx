import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Nav } from './Nav'

describe('Nav', () => {
  it('renders brand name', () => {
    render(<Nav />)
    expect(screen.getByText('NXD')).toBeInTheDocument()
    expect(screen.getByText('Manager Hub')).toBeInTheDocument()
  })

  it('navigation links point to correct sections', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: 'Features' })).toHaveAttribute('href', '#features')
    expect(screen.getByRole('link', { name: 'How it works' })).toHaveAttribute('href', '#how-it-works')
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about')
  })

  it('CTA link points to early access section', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: 'Get early access' })).toHaveAttribute('href', '#early-access')
  })
})
