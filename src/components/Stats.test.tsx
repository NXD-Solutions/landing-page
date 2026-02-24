import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Stats } from './Stats'

describe('Stats', () => {
  it('renders all stat values', () => {
    render(<Stats />)
    expect(screen.getByText('40%')).toBeInTheDocument()
    expect(screen.getByText('3×')).toBeInTheDocument()
    expect(screen.getByText('94%')).toBeInTheDocument()
    expect(screen.getByText('2 weeks')).toBeInTheDocument()
  })

  it('renders all stat labels', () => {
    render(<Stats />)
    expect(screen.getByText('less time on admin tasks')).toBeInTheDocument()
    expect(screen.getByText('faster team onboarding')).toBeInTheDocument()
    expect(screen.getByText('manager satisfaction score')).toBeInTheDocument()
    expect(screen.getByText('average time to first insight')).toBeInTheDocument()
  })
})
