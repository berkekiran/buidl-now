import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EnsResolverTool } from '../ens-resolver'

describe('EnsResolverTool', () => {
  it('renders without crashing', () => {
    render(<EnsResolverTool />)
    expect(screen.getByText('ENS Name')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resolve Address' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('shows placeholder text', () => {
    render(<EnsResolverTool />)
    expect(screen.getByPlaceholderText('vitalik.eth')).toBeInTheDocument()
  })

  it('shows error when input is empty', () => {
    render(<EnsResolverTool />)
    fireEvent.click(screen.getByRole('button', { name: 'Resolve Address' }))
    expect(screen.getByText(/Please enter an ENS name/)).toBeInTheDocument()
  })

  it('shows error when ENS name does not end with .eth', () => {
    render(<EnsResolverTool />)
    const input = screen.getByPlaceholderText('vitalik.eth')
    fireEvent.change(input, { target: { value: 'vitalik' } })
    fireEvent.click(screen.getByRole('button', { name: 'Resolve Address' }))
    expect(screen.getByText(/ENS name must end with .eth/)).toBeInTheDocument()
  })

  it('handles input changes', () => {
    render(<EnsResolverTool />)
    const input = screen.getByPlaceholderText('vitalik.eth')
    fireEvent.change(input, { target: { value: 'test.eth' } })
    expect(input).toHaveValue('test.eth')
  })

  it('resets the form', () => {
    render(<EnsResolverTool />)
    const input = screen.getByPlaceholderText('vitalik.eth')
    fireEvent.change(input, { target: { value: 'test.eth' } })
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(input).toHaveValue('')
  })

  it('shows advanced settings toggle', () => {
    render(<EnsResolverTool />)
    expect(screen.getByRole('button', { name: /Advanced Settings/ })).toBeInTheDocument()
  })

  it('toggles advanced settings', () => {
    render(<EnsResolverTool />)
    const advancedButton = screen.getByRole('button', { name: /Advanced Settings/ })
    fireEvent.click(advancedButton)
    expect(screen.getByText('Custom RPC URL (optional)')).toBeInTheDocument()
  })

  it('shows live data info box', () => {
    render(<EnsResolverTool />)
    expect(screen.getByText(/Live Data:/)).toBeInTheDocument()
  })
})
