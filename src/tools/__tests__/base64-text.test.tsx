import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Base64TextTool } from '../base64-text'

describe('Base64TextTool', () => {
  it('renders without crashing', () => {
    render(<Base64TextTool />)
    // There are multiple Encode buttons (mode selector and action button)
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })
    expect(encodeButtons.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays correct labels for encode mode', () => {
    render(<Base64TextTool />)
    expect(screen.getByText('Text')).toBeInTheDocument()
  })

  it('encodes text to Base64', () => {
    render(<Base64TextTool />)
    const input = screen.getByPlaceholderText('Enter text to encode...')
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })
    // The action button is in the input section (second button)
    const encodeButton = encodeButtons[encodeButtons.length - 1]

    fireEvent.change(input, { target: { value: 'Hello, World!' } })
    fireEvent.click(encodeButton)

    // Hello, World! in Base64 is SGVsbG8sIFdvcmxkIQ==
    expect(screen.getByDisplayValue('SGVsbG8sIFdvcmxkIQ==')).toBeInTheDocument()
  })

  it('switches to decode mode', () => {
    render(<Base64TextTool />)
    const decodeButtons = screen.getAllByRole('button', { name: 'Decode' })
    const decodeModeButton = decodeButtons[0] // First one is the mode button

    fireEvent.click(decodeModeButton)

    expect(screen.getByText('Base64')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter Base64 to decode...')).toBeInTheDocument()
  })

  it('decodes Base64 to text', () => {
    render(<Base64TextTool />)

    // Switch to decode mode
    const decodeButtons = screen.getAllByRole('button', { name: 'Decode' })
    fireEvent.click(decodeButtons[0])

    const input = screen.getByPlaceholderText('Enter Base64 to decode...')
    fireEvent.change(input, { target: { value: 'SGVsbG8sIFdvcmxkIQ==' } })

    // Click the decode action button (now the second Decode button)
    const decodeActionButtons = screen.getAllByRole('button', { name: 'Decode' })
    fireEvent.click(decodeActionButtons[decodeActionButtons.length - 1])

    expect(screen.getByDisplayValue('Hello, World!')).toBeInTheDocument()
  })

  it('resets all fields when reset button is clicked', () => {
    render(<Base64TextTool />)
    const input = screen.getByPlaceholderText('Enter text to encode...')
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })

    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(encodeButtons[encodeButtons.length - 1])

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(input).toHaveValue('')
  })

  it('handles empty input gracefully', () => {
    render(<Base64TextTool />)
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })

    fireEvent.click(encodeButtons[encodeButtons.length - 1])

    // Should not throw and output should be empty
    const textareas = screen.getAllByRole('textbox')
    expect(textareas.length).toBeGreaterThan(0)
  })

  it('clears output when switching modes', () => {
    render(<Base64TextTool />)
    const input = screen.getByPlaceholderText('Enter text to encode...')
    const encodeButtons = screen.getAllByRole('button', { name: 'Encode' })

    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(encodeButtons[encodeButtons.length - 1])

    // Switch to decode mode
    const decodeButtons = screen.getAllByRole('button', { name: 'Decode' })
    fireEvent.click(decodeButtons[0])

    // Output should be cleared
    expect(screen.queryByDisplayValue('SGVsbG8=')).not.toBeInTheDocument()
  })
})
