import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { UnicodeEscapeTool } from '../unicode-escape'

describe('UnicodeEscapeTool', () => {
  it('renders without crashing', () => {
    render(<UnicodeEscapeTool />)
    // Mode buttons
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })
    expect(encodeButtons.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('starts in encode mode with JavaScript format', () => {
    render(<UnicodeEscapeTool />)
    expect(screen.getByText('Text Input')).toBeInTheDocument()
    expect(screen.getByText('Escape Format')).toBeInTheDocument()
    expect(screen.getByText(/JavaScript/)).toBeInTheDocument()
  })

  it('encodes text to JavaScript Unicode escape', () => {
    render(<UnicodeEscapeTool />)
    const input = screen.getByPlaceholderText(/Enter text with Unicode characters/)
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })

    fireEvent.change(input, { target: { value: 'cafe' } })
    fireEvent.click(encodeButtons[encodeButtons.length - 1])

    // 'e' with acute accent should be escaped
    expect(screen.getByText('Escaped Output')).toBeInTheDocument()
  })

  it('switches to decode mode', () => {
    render(<UnicodeEscapeTool />)
    const decodeButtons = screen.getAllByRole('button', { name: 'Decode' })

    fireEvent.click(decodeButtons[0])

    expect(screen.getByText('Escaped Input')).toBeInTheDocument()
  })

  it('decodes JavaScript Unicode escape to text', () => {
    render(<UnicodeEscapeTool />)

    // Switch to decode mode
    const decodeModeButton = screen.getAllByRole('button', { name: 'Decode' })[0]
    fireEvent.click(decodeModeButton)

    const input = screen.getByPlaceholderText(/Enter escaped text/)
    fireEvent.change(input, { target: { value: '\\u0048\\u0065\\u006c\\u006c\\u006f' } })

    const decodeButtons = screen.getAllByRole('button', { name: 'Decode' })
    fireEvent.click(decodeButtons[decodeButtons.length - 1])

    expect(screen.getByText('Decoded Text')).toBeInTheDocument()
    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toBe('Hello')
  })

  it('switches to Python format', () => {
    render(<UnicodeEscapeTool />)

    const pythonButton = screen.getByRole('button', { name: 'Python' })
    fireEvent.click(pythonButton)

    expect(screen.getAllByText(/Python/).length).toBeGreaterThanOrEqual(1)
  })

  it('switches to CSS format', () => {
    render(<UnicodeEscapeTool />)

    const cssButton = screen.getByRole('button', { name: 'Css' })
    fireEvent.click(cssButton)

    expect(screen.getAllByText(/CSS/).length).toBeGreaterThanOrEqual(1)
  })

  it('switches to HTML format', () => {
    render(<UnicodeEscapeTool />)

    const htmlButton = screen.getByRole('button', { name: 'Html' })
    fireEvent.click(htmlButton)

    expect(screen.getAllByText(/HTML/).length).toBeGreaterThanOrEqual(1)
  })

  it('encodes to HTML entities', () => {
    render(<UnicodeEscapeTool />)

    // Switch to HTML format
    const htmlButton = screen.getByRole('button', { name: 'Html' })
    fireEvent.click(htmlButton)

    const input = screen.getByPlaceholderText(/Enter text with Unicode characters/)
    fireEvent.change(input, { target: { value: 'A' } })

    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })
    fireEvent.click(encodeButtons[encodeButtons.length - 1])

    // ASCII character 'A' should remain as-is (only non-ASCII gets encoded by default)
    expect(screen.getByText('Escaped Output')).toBeInTheDocument()
  })

  it('toggles encode all characters option', () => {
    render(<UnicodeEscapeTool />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('encodes all characters when option is enabled', () => {
    render(<UnicodeEscapeTool />)

    // Enable encode all option
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    const input = screen.getByPlaceholderText(/Enter text with Unicode characters/)
    fireEvent.change(input, { target: { value: 'Hi' } })

    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })
    fireEvent.click(encodeButtons[encodeButtons.length - 1])

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    // 'H' = \u0048, 'i' = \u0069
    expect(outputTextarea?.value).toContain('\\u')
  })

  it('resets all fields when reset button is clicked', () => {
    render(<UnicodeEscapeTool />)
    const input = screen.getByPlaceholderText(/Enter text with Unicode characters/) as HTMLTextAreaElement
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })

    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(encodeButtons[encodeButtons.length - 1])

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(input.value).toBe('')
    expect(screen.queryByText('Escaped Output')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<UnicodeEscapeTool />)
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })

    fireEvent.click(encodeButtons[encodeButtons.length - 1])

    // Should not show output for empty input
    expect(screen.queryByText('Escaped Output')).not.toBeInTheDocument()
  })

  it('clears output when switching modes', () => {
    render(<UnicodeEscapeTool />)
    const input = screen.getByPlaceholderText(/Enter text with Unicode characters/)
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })

    // Enable encode all to ensure output is generated
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    fireEvent.change(input, { target: { value: 'Hi' } })
    fireEvent.click(encodeButtons[encodeButtons.length - 1])

    expect(screen.getByText('Escaped Output')).toBeInTheDocument()

    // Switch to decode mode
    const decodeModeButton = screen.getAllByRole('button', { name: 'Decode' })[0]
    fireEvent.click(decodeModeButton)

    // Output should be cleared
    expect(screen.queryByText('Escaped Output')).not.toBeInTheDocument()
  })

  it('clears output when switching formats', () => {
    render(<UnicodeEscapeTool />)
    const input = screen.getByPlaceholderText(/Enter text with Unicode characters/)
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })

    // Enable encode all
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    fireEvent.change(input, { target: { value: 'Hi' } })
    fireEvent.click(encodeButtons[encodeButtons.length - 1])

    expect(screen.getByText('Escaped Output')).toBeInTheDocument()

    // Switch to HTML format
    const htmlButton = screen.getByRole('button', { name: 'Html' })
    fireEvent.click(htmlButton)

    // Output should be cleared
    expect(screen.queryByText('Escaped Output')).not.toBeInTheDocument()
  })
})
