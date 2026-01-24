import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RemoveDuplicatesTool } from '../remove-duplicates'

// Helper to get output textarea (readonly one)
const getOutputTextarea = () => {
  const textareas = screen.getAllByRole('textbox')
  return textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
}

describe('RemoveDuplicatesTool', () => {
  it('renders without crashing', () => {
    render(<RemoveDuplicatesTool />)
    expect(screen.getByText('Input Text (one line per item)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove Duplicates' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('shows case sensitive checkbox', () => {
    render(<RemoveDuplicatesTool />)
    expect(screen.getByText('Case Sensitive')).toBeInTheDocument()
  })

  it('removes duplicate lines', () => {
    render(<RemoveDuplicatesTool />)
    const input = screen.getByPlaceholderText(/Enter lines with potential duplicates/)
    fireEvent.change(input, { target: { value: 'apple\nbanana\napple\ncherry' } })
    fireEvent.click(screen.getByRole('button', { name: 'Remove Duplicates' }))

    expect(screen.getByText('Output (Duplicates Removed)')).toBeInTheDocument()
    const output = getOutputTextarea()
    expect(output?.value).toBe('apple\nbanana\ncherry')
  })

  it('shows statistics after removing duplicates', () => {
    render(<RemoveDuplicatesTool />)
    const input = screen.getByPlaceholderText(/Enter lines with potential duplicates/)
    fireEvent.change(input, { target: { value: 'apple\nbanana\napple\ncherry' } })
    fireEvent.click(screen.getByRole('button', { name: 'Remove Duplicates' }))

    expect(screen.getByText('4')).toBeInTheDocument() // Original Lines
    expect(screen.getByText('3')).toBeInTheDocument() // Unique Lines
    expect(screen.getByText('1')).toBeInTheDocument() // Duplicates Removed
    expect(screen.getByText('Original Lines')).toBeInTheDocument()
    expect(screen.getByText('Unique Lines')).toBeInTheDocument()
    expect(screen.getByText('Duplicates Removed')).toBeInTheDocument()
  })

  it('is case insensitive by default', () => {
    render(<RemoveDuplicatesTool />)
    const input = screen.getByPlaceholderText(/Enter lines with potential duplicates/)
    fireEvent.change(input, { target: { value: 'Apple\napple\nAPPLE' } })
    fireEvent.click(screen.getByRole('button', { name: 'Remove Duplicates' }))

    const output = getOutputTextarea()
    expect(output?.value).toBe('Apple')
    expect(screen.getByText('2')).toBeInTheDocument() // Duplicates Removed
  })

  it('respects case sensitive option', () => {
    render(<RemoveDuplicatesTool />)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    const input = screen.getByPlaceholderText(/Enter lines with potential duplicates/)
    fireEvent.change(input, { target: { value: 'Apple\napple\nAPPLE' } })
    fireEvent.click(screen.getByRole('button', { name: 'Remove Duplicates' }))

    const output = getOutputTextarea()
    expect(output?.value).toBe('Apple\napple\nAPPLE')
    expect(screen.getByText('0')).toBeInTheDocument() // Duplicates Removed
  })

  it('handles empty input', () => {
    render(<RemoveDuplicatesTool />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove Duplicates' }))
    expect(screen.queryByText('Output (Duplicates Removed)')).not.toBeInTheDocument()
  })

  it('preserves order of first occurrence', () => {
    render(<RemoveDuplicatesTool />)
    const input = screen.getByPlaceholderText(/Enter lines with potential duplicates/)
    fireEvent.change(input, { target: { value: 'cherry\napple\nbanana\napple\ncherry' } })
    fireEvent.click(screen.getByRole('button', { name: 'Remove Duplicates' }))

    const output = getOutputTextarea()
    expect(output?.value).toBe('cherry\napple\nbanana')
  })

  it('resets the form', () => {
    render(<RemoveDuplicatesTool />)
    const input = screen.getByPlaceholderText(/Enter lines with potential duplicates/)
    fireEvent.change(input, { target: { value: 'apple\nbanana' } })
    fireEvent.click(screen.getByRole('button', { name: 'Remove Duplicates' }))
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(input).toHaveValue('')
    expect(screen.queryByText('Output (Duplicates Removed)')).not.toBeInTheDocument()
  })

  it('handles single line input', () => {
    render(<RemoveDuplicatesTool />)
    const input = screen.getByPlaceholderText(/Enter lines with potential duplicates/)
    fireEvent.change(input, { target: { value: 'single line' } })
    fireEvent.click(screen.getByRole('button', { name: 'Remove Duplicates' }))

    const output = getOutputTextarea()
    expect(output?.value).toBe('single line')
    expect(screen.getByText('0')).toBeInTheDocument() // Duplicates Removed
  })
})
