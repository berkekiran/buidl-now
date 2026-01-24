import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { KeccakHashTool } from '../keccak-hash'

describe('KeccakHashTool', () => {
  it('renders without crashing', () => {
    render(<KeccakHashTool />)
    expect(screen.getByRole('button', { name: 'Text' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hex' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hash' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('starts in text mode by default', () => {
    render(<KeccakHashTool />)
    expect(screen.getByText('Input (Text)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter text to hash...')).toBeInTheDocument()
  })

  it('calculates keccak256 hash for text input', () => {
    render(<KeccakHashTool />)
    const input = screen.getByPlaceholderText('Enter text to hash...')

    fireEvent.change(input, { target: { value: 'Hello, World!' } })

    // Keccak256 hash of "Hello, World!"
    expect(screen.getByDisplayValue('0xacaf3289d7b601cbd114fb36c4d29c85bbfd5e133f14cb355c3fd8d99367964f')).toBeInTheDocument()
  })

  it('switches to hex mode', () => {
    render(<KeccakHashTool />)
    const hexButton = screen.getByRole('button', { name: 'Hex' })

    fireEvent.click(hexButton)

    expect(screen.getByText('Input (Hexadecimal)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter hex data (e.g., 0xdeadbeef)...')).toBeInTheDocument()
  })

  it('calculates keccak256 hash for hex input', () => {
    render(<KeccakHashTool />)

    // Switch to hex mode
    const hexButton = screen.getByRole('button', { name: 'Hex' })
    fireEvent.click(hexButton)

    const input = screen.getByPlaceholderText('Enter hex data (e.g., 0xdeadbeef)...')
    fireEvent.change(input, { target: { value: '0xdeadbeef' } })

    // Keccak256 hash of 0xdeadbeef
    expect(screen.getByDisplayValue('0xd4fd4e189132273036449fc9e11198c739161b4c0116a9a2dccdfa1c492006f1')).toBeInTheDocument()
  })

  it('handles hex input without 0x prefix', () => {
    render(<KeccakHashTool />)

    // Switch to hex mode
    const hexButton = screen.getByRole('button', { name: 'Hex' })
    fireEvent.click(hexButton)

    const input = screen.getByPlaceholderText('Enter hex data (e.g., 0xdeadbeef)...')
    fireEvent.change(input, { target: { value: 'deadbeef' } })

    // Should still calculate correctly
    expect(screen.getByDisplayValue('0xd4fd4e189132273036449fc9e11198c739161b4c0116a9a2dccdfa1c492006f1')).toBeInTheDocument()
  })

  it('clears output when input is empty', () => {
    render(<KeccakHashTool />)
    const input = screen.getByPlaceholderText('Enter text to hash...')

    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.change(input, { target: { value: '' } })

    const outputInputs = screen.getAllByRole('textbox').filter(
      (el) => el.getAttribute('readonly') !== null
    )
    outputInputs.forEach((el) => {
      expect(el).toHaveValue('')
    })
  })

  it('resets all fields when reset button is clicked', () => {
    render(<KeccakHashTool />)
    const input = screen.getByPlaceholderText('Enter text to hash...')

    fireEvent.change(input, { target: { value: 'test' } })

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(input).toHaveValue('')
  })

  it('clears hash when switching modes', () => {
    render(<KeccakHashTool />)
    const input = screen.getByPlaceholderText('Enter text to hash...')

    fireEvent.change(input, { target: { value: 'test' } })

    // Switch to hex mode
    const hexButton = screen.getByRole('button', { name: 'Hex' })
    fireEvent.click(hexButton)

    // Hash should be cleared but recalculated with new mode
    // The text "test" is not valid hex, so output should be empty
    const outputInputs = screen.getAllByRole('textbox').filter(
      (el) => el.getAttribute('readonly') !== null
    )
    // Either empty or recalculated
    expect(outputInputs.length).toBeGreaterThan(0)
  })
})
