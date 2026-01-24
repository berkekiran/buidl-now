import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MethodIdFinderTool } from '../method-id-finder'

// Mock window.open
vi.stubGlobal('open', vi.fn())

describe('MethodIdFinderTool', () => {
  it('renders without crashing', () => {
    render(<MethodIdFinderTool />)
    expect(screen.getByText('Method ID (4 bytes)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search on 4byte.directory' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('shows placeholder text', () => {
    render(<MethodIdFinderTool />)
    expect(screen.getByPlaceholderText('0xa9059cbb')).toBeInTheDocument()
  })

  it('shows error when input is empty', () => {
    render(<MethodIdFinderTool />)
    fireEvent.click(screen.getByRole('button', { name: 'Search on 4byte.directory' }))
    expect(screen.getByText(/Please enter a method ID/)).toBeInTheDocument()
  })

  it('shows error for invalid method ID format', () => {
    render(<MethodIdFinderTool />)
    const input = screen.getByPlaceholderText('0xa9059cbb')
    fireEvent.change(input, { target: { value: '0x123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Search on 4byte.directory' }))
    expect(screen.getByText(/Invalid method ID format/)).toBeInTheDocument()
  })

  it('opens 4byte.directory on valid method ID', () => {
    render(<MethodIdFinderTool />)
    const input = screen.getByPlaceholderText('0xa9059cbb')
    fireEvent.change(input, { target: { value: '0xa9059cbb' } })
    fireEvent.click(screen.getByRole('button', { name: 'Search on 4byte.directory' }))
    expect(window.open).toHaveBeenCalledWith(
      'https://www.4byte.directory/signatures/?bytes4_signature=0xa9059cbb',
      '_blank'
    )
  })

  it('handles method ID without 0x prefix', () => {
    render(<MethodIdFinderTool />)
    const input = screen.getByPlaceholderText('0xa9059cbb')
    fireEvent.change(input, { target: { value: 'a9059cbb' } })
    fireEvent.click(screen.getByRole('button', { name: 'Search on 4byte.directory' }))
    expect(window.open).toHaveBeenCalledWith(
      'https://www.4byte.directory/signatures/?bytes4_signature=0xa9059cbb',
      '_blank'
    )
  })

  it('shows common examples', () => {
    render(<MethodIdFinderTool />)
    expect(screen.getByText('Common Examples')).toBeInTheDocument()
    expect(screen.getByText('0xa9059cbb')).toBeInTheDocument()
    expect(screen.getByText('transfer(address,uint256)')).toBeInTheDocument()
    expect(screen.getByText('0x095ea7b3')).toBeInTheDocument()
    expect(screen.getByText('approve(address,uint256)')).toBeInTheDocument()
  })

  it('sets input when clicking example', () => {
    render(<MethodIdFinderTool />)
    // Get all buttons that contain the method id text
    const buttons = screen.getAllByRole('button')
    const exampleButton = buttons.find(btn => btn.textContent?.includes('0xa9059cbb') && btn.textContent?.includes('transfer'))
    fireEvent.click(exampleButton!)
    const input = screen.getByPlaceholderText('0xa9059cbb')
    expect(input).toHaveValue('0xa9059cbb')
  })

  it('resets the form', () => {
    render(<MethodIdFinderTool />)
    const input = screen.getByPlaceholderText('0xa9059cbb')
    fireEvent.change(input, { target: { value: '0xtest' } })
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(input).toHaveValue('')
  })

  it('shows info box about how it works', () => {
    render(<MethodIdFinderTool />)
    expect(screen.getByText(/How it works:/)).toBeInTheDocument()
  })
})
