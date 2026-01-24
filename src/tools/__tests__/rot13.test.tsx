import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Rot13Tool } from '../rot13'

// Helper to get output textarea (readonly one)
const getOutputTextarea = () => {
  const textareas = screen.getAllByRole('textbox')
  return textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
}

describe('Rot13Tool', () => {
  it('renders without crashing', () => {
    render(<Rot13Tool />)
    expect(screen.getByText('Input Text')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /convert \(rot13\)/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('converts Hello to Uryyb', () => {
    render(<Rot13Tool />)
    const textarea = screen.getByPlaceholderText('Enter text to encode/decode with ROT13...')

    fireEvent.change(textarea, { target: { value: 'Hello' } })

    const convertButton = screen.getByRole('button', { name: /convert \(rot13\)/i })
    fireEvent.click(convertButton)

    expect(screen.getByText('ROT13 Output')).toBeInTheDocument()
    const output = getOutputTextarea()
    expect(output?.value).toBe('Uryyb')
  })

  it('converts Hello World correctly', () => {
    render(<Rot13Tool />)
    const textarea = screen.getByPlaceholderText('Enter text to encode/decode with ROT13...')

    fireEvent.change(textarea, { target: { value: 'Hello World' } })

    const convertButton = screen.getByRole('button', { name: /convert \(rot13\)/i })
    fireEvent.click(convertButton)

    const output = getOutputTextarea()
    expect(output?.value).toBe('Uryyb Jbeyq')
  })

  it('is self-inverse (double conversion returns original)', () => {
    render(<Rot13Tool />)
    const textarea = screen.getByPlaceholderText('Enter text to encode/decode with ROT13...')

    // First conversion
    fireEvent.change(textarea, { target: { value: 'Hello' } })
    const convertButton = screen.getByRole('button', { name: /convert \(rot13\)/i })
    fireEvent.click(convertButton)

    let output = getOutputTextarea()
    expect(output?.value).toBe('Uryyb')

    // Second conversion (decode)
    fireEvent.change(textarea, { target: { value: 'Uryyb' } })
    fireEvent.click(convertButton)

    output = getOutputTextarea()
    expect(output?.value).toBe('Hello')
  })

  it('preserves numbers', () => {
    render(<Rot13Tool />)
    const textarea = screen.getByPlaceholderText('Enter text to encode/decode with ROT13...')

    fireEvent.change(textarea, { target: { value: 'Test123' } })

    const convertButton = screen.getByRole('button', { name: /convert \(rot13\)/i })
    fireEvent.click(convertButton)

    const output = getOutputTextarea()
    expect(output?.value).toBe('Grfg123')
  })

  it('preserves punctuation', () => {
    render(<Rot13Tool />)
    const textarea = screen.getByPlaceholderText('Enter text to encode/decode with ROT13...')

    fireEvent.change(textarea, { target: { value: 'Hello!' } })

    const convertButton = screen.getByRole('button', { name: /convert \(rot13\)/i })
    fireEvent.click(convertButton)

    const output = getOutputTextarea()
    expect(output?.value).toBe('Uryyb!')
  })

  it('handles uppercase letters correctly', () => {
    render(<Rot13Tool />)
    const textarea = screen.getByPlaceholderText('Enter text to encode/decode with ROT13...')

    fireEvent.change(textarea, { target: { value: 'ABC' } })

    const convertButton = screen.getByRole('button', { name: /convert \(rot13\)/i })
    fireEvent.click(convertButton)

    const output = getOutputTextarea()
    expect(output?.value).toBe('NOP')
  })

  it('handles lowercase letters correctly', () => {
    render(<Rot13Tool />)
    const textarea = screen.getByPlaceholderText('Enter text to encode/decode with ROT13...')

    fireEvent.change(textarea, { target: { value: 'abc' } })

    const convertButton = screen.getByRole('button', { name: /convert \(rot13\)/i })
    fireEvent.click(convertButton)

    const output = getOutputTextarea()
    expect(output?.value).toBe('nop')
  })

  it('resets input and output', () => {
    render(<Rot13Tool />)
    const textarea = screen.getByPlaceholderText('Enter text to encode/decode with ROT13...') as HTMLTextAreaElement

    fireEvent.change(textarea, { target: { value: 'Test' } })

    const convertButton = screen.getByRole('button', { name: /convert \(rot13\)/i })
    fireEvent.click(convertButton)

    expect(screen.getByText('ROT13 Output')).toBeInTheDocument()

    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)

    expect(textarea.value).toBe('')
    expect(screen.queryByText('ROT13 Output')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<Rot13Tool />)

    const convertButton = screen.getByRole('button', { name: /convert \(rot13\)/i })
    fireEvent.click(convertButton)

    // Should not show output for empty input
    expect(screen.queryByText('ROT13 Output')).not.toBeInTheDocument()
  })

  it('handles special characters', () => {
    render(<Rot13Tool />)
    const textarea = screen.getByPlaceholderText('Enter text to encode/decode with ROT13...')

    fireEvent.change(textarea, { target: { value: '@#$%' } })

    const convertButton = screen.getByRole('button', { name: /convert \(rot13\)/i })
    fireEvent.click(convertButton)

    // Special characters should remain unchanged
    const output = getOutputTextarea()
    expect(output?.value).toBe('@#$%')
  })
})
