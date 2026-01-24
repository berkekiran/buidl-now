import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EscapeUnescapeTool } from '../escape-unescape'

// Helper to get output textarea (readonly one)
const getOutputTextarea = () => {
  const textareas = screen.getAllByRole('textbox')
  return textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
}

describe('EscapeUnescapeTool', () => {
  it('renders without crashing', () => {
    render(<EscapeUnescapeTool />)
    expect(screen.getByText('Input Text')).toBeInTheDocument()
    // Use getAllByRole and check length for buttons that might have multiple matches
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(3) // Escape, Unescape, Reset
  })

  it('escapes newlines correctly', () => {
    render(<EscapeUnescapeTool />)
    const textarea = screen.getByPlaceholderText('Enter text with special characters...')

    fireEvent.change(textarea, { target: { value: 'Line1\nLine2' } })

    // Get Escape button (the primary one, which is first)
    const buttons = screen.getAllByRole('button')
    const escapeButton = buttons.find(b => b.textContent === 'Escape')!
    fireEvent.click(escapeButton)

    expect(screen.getByText('Output')).toBeInTheDocument()
    const output = getOutputTextarea()
    expect(output?.value).toBe('Line1\\nLine2')
  })

  it('escapes double quotes correctly', () => {
    render(<EscapeUnescapeTool />)
    const textarea = screen.getByPlaceholderText('Enter text with special characters...')

    fireEvent.change(textarea, { target: { value: 'He said "Hello"' } })

    const buttons = screen.getAllByRole('button')
    const escapeButton = buttons.find(b => b.textContent === 'Escape')!
    fireEvent.click(escapeButton)

    const output = getOutputTextarea()
    expect(output?.value).toBe('He said \\"Hello\\"')
  })

  it('escapes tabs correctly', () => {
    render(<EscapeUnescapeTool />)
    const textarea = screen.getByPlaceholderText('Enter text with special characters...')

    fireEvent.change(textarea, { target: { value: 'Col1\tCol2' } })

    const buttons = screen.getAllByRole('button')
    const escapeButton = buttons.find(b => b.textContent === 'Escape')!
    fireEvent.click(escapeButton)

    const output = getOutputTextarea()
    expect(output?.value).toBe('Col1\\tCol2')
  })

  it('escapes backslashes correctly', () => {
    render(<EscapeUnescapeTool />)
    const textarea = screen.getByPlaceholderText('Enter text with special characters...')

    fireEvent.change(textarea, { target: { value: 'path\\to\\file' } })

    const buttons = screen.getAllByRole('button')
    const escapeButton = buttons.find(b => b.textContent === 'Escape')!
    fireEvent.click(escapeButton)

    const output = getOutputTextarea()
    expect(output?.value).toBe('path\\\\to\\\\file')
  })

  it('unescapes newlines correctly', () => {
    render(<EscapeUnescapeTool />)
    const textarea = screen.getByPlaceholderText('Enter text with special characters...')

    fireEvent.change(textarea, { target: { value: 'Line1\\nLine2' } })

    const unescapeButton = screen.getByRole('button', { name: 'Unescape' })
    fireEvent.click(unescapeButton)

    expect(screen.getByText('Output')).toBeInTheDocument()
    const output = getOutputTextarea()
    expect(output?.value).toBe('Line1\nLine2')
  })

  it('unescapes double quotes correctly', () => {
    render(<EscapeUnescapeTool />)
    const textarea = screen.getByPlaceholderText('Enter text with special characters...')

    fireEvent.change(textarea, { target: { value: 'He said \\"Hello\\"' } })

    const unescapeButton = screen.getByRole('button', { name: 'Unescape' })
    fireEvent.click(unescapeButton)

    const output = getOutputTextarea()
    expect(output?.value).toBe('He said "Hello"')
  })

  it('resets input and output when reset button is clicked', () => {
    render(<EscapeUnescapeTool />)
    const textarea = screen.getByPlaceholderText('Enter text with special characters...') as HTMLTextAreaElement

    fireEvent.change(textarea, { target: { value: 'test\nvalue' } })

    const buttons = screen.getAllByRole('button')
    const escapeButton = buttons.find(b => b.textContent === 'Escape')!
    fireEvent.click(escapeButton)

    expect(screen.getByText('Output')).toBeInTheDocument()

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(textarea.value).toBe('')
    expect(screen.queryByText('Output')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<EscapeUnescapeTool />)

    const buttons = screen.getAllByRole('button')
    const escapeButton = buttons.find(b => b.textContent === 'Escape')!
    fireEvent.click(escapeButton)

    // Should not show output for empty input
    expect(screen.queryByText('Output')).not.toBeInTheDocument()
  })
})
