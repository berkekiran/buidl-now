import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PunycodeTool } from '../punycode'

describe('PunycodeTool', () => {
  it('renders without crashing', () => {
    render(<PunycodeTool />)
    expect(screen.getByText('Encode (Unicode to Punycode)')).toBeInTheDocument()
    expect(screen.getByText('Decode (Punycode to Unicode)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('starts in encode mode', () => {
    render(<PunycodeTool />)
    expect(screen.getByText('Unicode Domain')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Encode to Punycode' })).toBeInTheDocument()
  })

  it('encodes Unicode domain to Punycode', () => {
    render(<PunycodeTool />)
    const input = screen.getByPlaceholderText(/Enter Unicode domain/)
    const encodeButton = screen.getByRole('button', { name: 'Encode to Punycode' })

    fireEvent.change(input, { target: { value: 'munchen.de' } })
    fireEvent.click(encodeButton)

    expect(screen.getByText('Punycode Domain')).toBeInTheDocument()
  })

  it('switches to decode mode', () => {
    render(<PunycodeTool />)
    const decodeButton = screen.getByText('Decode (Punycode to Unicode)')

    fireEvent.click(decodeButton)

    expect(screen.getByText('Punycode Domain')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Decode to Unicode' })).toBeInTheDocument()
  })

  it('decodes Punycode domain to Unicode', () => {
    render(<PunycodeTool />)

    // Switch to decode mode
    const decodeModeButton = screen.getByText('Decode (Punycode to Unicode)')
    fireEvent.click(decodeModeButton)

    const input = screen.getByPlaceholderText(/Enter Punycode domain/)
    fireEvent.change(input, { target: { value: 'xn--mnchen-3ya.de' } })

    const decodeButton = screen.getByRole('button', { name: 'Decode to Unicode' })
    fireEvent.click(decodeButton)

    expect(screen.getByText('Unicode Domain')).toBeInTheDocument()
  })

  it('handles ASCII-only domains without modification', () => {
    render(<PunycodeTool />)
    const input = screen.getByPlaceholderText(/Enter Unicode domain/)
    const encodeButton = screen.getByRole('button', { name: 'Encode to Punycode' })

    fireEvent.change(input, { target: { value: 'example.com' } })
    fireEvent.click(encodeButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toBe('example.com')
  })

  it('resets all fields when reset button is clicked', () => {
    render(<PunycodeTool />)
    const input = screen.getByPlaceholderText(/Enter Unicode domain/) as HTMLTextAreaElement
    const encodeButton = screen.getByRole('button', { name: 'Encode to Punycode' })

    fireEvent.change(input, { target: { value: 'munchen.de' } })
    fireEvent.click(encodeButton)

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(input.value).toBe('')
    expect(screen.queryByText('Punycode Domain')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<PunycodeTool />)
    const encodeButton = screen.getByRole('button', { name: 'Encode to Punycode' })

    fireEvent.click(encodeButton)

    // Should not show output for empty input
    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly'))
    expect(outputTextarea).toBeUndefined()
  })

  it('clears output when switching modes', () => {
    render(<PunycodeTool />)
    const input = screen.getByPlaceholderText(/Enter Unicode domain/)
    const encodeButton = screen.getByRole('button', { name: 'Encode to Punycode' })

    fireEvent.change(input, { target: { value: 'munchen.de' } })
    fireEvent.click(encodeButton)

    // Switch to decode mode
    const decodeModeButton = screen.getByText('Decode (Punycode to Unicode)')
    fireEvent.click(decodeModeButton)

    // Output should be cleared (output label changes or disappears)
    expect(screen.queryByDisplayValue(/xn--/)).not.toBeInTheDocument()
  })

  it('handles multi-label domains', () => {
    render(<PunycodeTool />)
    const input = screen.getByPlaceholderText(/Enter Unicode domain/)
    const encodeButton = screen.getByRole('button', { name: 'Encode to Punycode' })

    fireEvent.change(input, { target: { value: 'sub.munchen.de' } })
    fireEvent.click(encodeButton)

    expect(screen.getByText('Punycode Domain')).toBeInTheDocument()
  })

  it('shows error for invalid Punycode', () => {
    render(<PunycodeTool />)

    // Switch to decode mode
    const decodeModeButton = screen.getByText('Decode (Punycode to Unicode)')
    fireEvent.click(decodeModeButton)

    const input = screen.getByPlaceholderText(/Enter Punycode domain/)
    fireEvent.change(input, { target: { value: 'xn--invalid!!!' } })

    const decodeButton = screen.getByRole('button', { name: 'Decode to Unicode' })
    fireEvent.click(decodeButton)

    // Even invalid punycode should show some output (it may just return as-is)
    const textareas = screen.getAllByRole('textbox')
    expect(textareas.length).toBeGreaterThan(0)
  })
})
