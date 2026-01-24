import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FunctionSelectorTool } from '../function-selector'

describe('FunctionSelectorTool', () => {
  it('renders without crashing', () => {
    render(<FunctionSelectorTool />)
    expect(screen.getByText('Function')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Convert' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays placeholder text', () => {
    render(<FunctionSelectorTool />)
    expect(screen.getByPlaceholderText('function ownerOf(uint256 tokenId)')).toBeInTheDocument()
  })

  it('calculates function selector for valid function signature', () => {
    render(<FunctionSelectorTool />)
    const input = screen.getByPlaceholderText('function ownerOf(uint256 tokenId)')

    fireEvent.change(input, { target: { value: 'balanceOf(address)' } })

    // The selector for balanceOf(address) is 0x70a08231
    const outputInput = screen.getByDisplayValue('0x70a08231')
    expect(outputInput).toBeInTheDocument()
  })

  it('calculates selector for Transfer function', () => {
    render(<FunctionSelectorTool />)
    const input = screen.getByPlaceholderText('function ownerOf(uint256 tokenId)')

    fireEvent.change(input, { target: { value: 'transfer(address,uint256)' } })

    // The selector for transfer(address,uint256) is 0xa9059cbb
    const outputInput = screen.getByDisplayValue('0xa9059cbb')
    expect(outputInput).toBeInTheDocument()
  })

  it('clears output when input is empty', () => {
    render(<FunctionSelectorTool />)
    const input = screen.getByPlaceholderText('function ownerOf(uint256 tokenId)')

    // First set a value
    fireEvent.change(input, { target: { value: 'balanceOf(address)' } })
    expect(screen.getByDisplayValue('0x70a08231')).toBeInTheDocument()

    // Then clear it
    fireEvent.change(input, { target: { value: '' } })

    // The output should be empty
    expect(screen.queryByDisplayValue('0x70a08231')).not.toBeInTheDocument()
  })

  it('does not calculate selector for invalid function signature without parentheses', () => {
    render(<FunctionSelectorTool />)
    const input = screen.getByPlaceholderText('function ownerOf(uint256 tokenId)')

    fireEvent.change(input, { target: { value: 'invalidFunction' } })

    // Should not produce output
    const outputs = screen.getAllByRole('textbox')
    const outputField = outputs.find(el => el.getAttribute('readonly') !== null)
    expect(outputField).toHaveValue('')
  })

  it('resets all fields when reset button is clicked', () => {
    render(<FunctionSelectorTool />)
    const input = screen.getByPlaceholderText('function ownerOf(uint256 tokenId)')

    // Set a value
    fireEvent.change(input, { target: { value: 'balanceOf(address)' } })
    expect(screen.getByDisplayValue('0x70a08231')).toBeInTheDocument()

    // Click reset
    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    // Both fields should be empty
    expect(input).toHaveValue('')
    expect(screen.queryByDisplayValue('0x70a08231')).not.toBeInTheDocument()
  })

  it('converts button triggers calculation', () => {
    render(<FunctionSelectorTool />)
    const input = screen.getByPlaceholderText('function ownerOf(uint256 tokenId)')
    const convertButton = screen.getByRole('button', { name: 'Convert' })

    fireEvent.change(input, { target: { value: 'ownerOf(uint256)' } })
    fireEvent.click(convertButton)

    // The selector for ownerOf(uint256) is 0x6352211e
    expect(screen.getByDisplayValue('0x6352211e')).toBeInTheDocument()
  })
})
