import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BinaryTextTool } from '../binary-text'

describe('BinaryTextTool', () => {
  it('renders without crashing', () => {
    render(<BinaryTextTool />)
    // There are mode buttons and action buttons, so use getAllBy
    expect(screen.getAllByRole('button', { name: /encode/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('button', { name: /decode/i }).length).toBeGreaterThanOrEqual(1)
  })

  it('starts in encode mode', () => {
    render(<BinaryTextTool />)
    expect(screen.getByText('Text')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter text to encode...')).toBeInTheDocument()
  })

  it('encodes text to binary', () => {
    render(<BinaryTextTool />)
    const textarea = screen.getByPlaceholderText('Enter text to encode...')

    fireEvent.change(textarea, { target: { value: 'A' } })

    // Click the encode button in the input section (not the mode button)
    const encodeButtons = screen.getAllByRole('button', { name: /^encode$/i })
    fireEvent.click(encodeButtons[1]) // The second encode button is the action button

    expect(screen.getByText('Binary')).toBeInTheDocument()
    expect(screen.getByDisplayValue('01000001')).toBeInTheDocument()
  })

  it('encodes Hello to correct binary', () => {
    render(<BinaryTextTool />)
    const textarea = screen.getByPlaceholderText('Enter text to encode...')

    fireEvent.change(textarea, { target: { value: 'Hi' } })

    const encodeButtons = screen.getAllByRole('button', { name: /^encode$/i })
    fireEvent.click(encodeButtons[1])

    // H = 01001000, i = 01101001
    expect(screen.getByDisplayValue('01001000 01101001')).toBeInTheDocument()
  })

  it('switches to decode mode', () => {
    render(<BinaryTextTool />)

    // Click the decode mode button (first one)
    const decodeModeButtons = screen.getAllByRole('button', { name: /^decode$/i })
    fireEvent.click(decodeModeButtons[0])

    expect(screen.getByText('Binary')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter binary to decode (spaces optional)...')).toBeInTheDocument()
  })

  it('decodes binary to text', () => {
    render(<BinaryTextTool />)

    // Switch to decode mode
    const decodeModeButtons = screen.getAllByRole('button', { name: /^decode$/i })
    fireEvent.click(decodeModeButtons[0])

    const textarea = screen.getByPlaceholderText('Enter binary to decode (spaces optional)...')

    fireEvent.change(textarea, { target: { value: '01001000 01101001' } })

    // Click the decode action button
    const decodeButtons = screen.getAllByRole('button', { name: /^decode$/i })
    fireEvent.click(decodeButtons[1])

    expect(screen.getByDisplayValue('Hi')).toBeInTheDocument()
  })

  it('decodes binary without spaces', () => {
    render(<BinaryTextTool />)

    // Switch to decode mode
    const decodeModeButtons = screen.getAllByRole('button', { name: /^decode$/i })
    fireEvent.click(decodeModeButtons[0])

    const textarea = screen.getByPlaceholderText('Enter binary to decode (spaces optional)...')

    fireEvent.change(textarea, { target: { value: '0100000101000010' } }) // AB

    const decodeButtons = screen.getAllByRole('button', { name: /^decode$/i })
    fireEvent.click(decodeButtons[1])

    expect(screen.getByDisplayValue('AB')).toBeInTheDocument()
  })

  it('shows error for invalid binary characters', () => {
    render(<BinaryTextTool />)

    // Switch to decode mode
    const decodeModeButtons = screen.getAllByRole('button', { name: /^decode$/i })
    fireEvent.click(decodeModeButtons[0])

    const textarea = screen.getByPlaceholderText('Enter binary to decode (spaces optional)...')

    fireEvent.change(textarea, { target: { value: '01002010' } })

    const decodeButtons = screen.getAllByRole('button', { name: /^decode$/i })
    fireEvent.click(decodeButtons[1])

    expect(screen.getByText(/only 0 and 1 are allowed/i)).toBeInTheDocument()
  })

  it('shows error for invalid binary length', () => {
    render(<BinaryTextTool />)

    // Switch to decode mode
    const decodeModeButtons = screen.getAllByRole('button', { name: /^decode$/i })
    fireEvent.click(decodeModeButtons[0])

    const textarea = screen.getByPlaceholderText('Enter binary to decode (spaces optional)...')

    fireEvent.change(textarea, { target: { value: '0100001' } }) // 7 bits, not 8

    const decodeButtons = screen.getAllByRole('button', { name: /^decode$/i })
    fireEvent.click(decodeButtons[1])

    expect(screen.getByText(/must be a multiple of 8/i)).toBeInTheDocument()
  })

  it('resets input and output', () => {
    render(<BinaryTextTool />)
    const textarea = screen.getByPlaceholderText('Enter text to encode...') as HTMLTextAreaElement

    fireEvent.change(textarea, { target: { value: 'Test' } })

    const encodeButtons = screen.getAllByRole('button', { name: /^encode$/i })
    fireEvent.click(encodeButtons[1])

    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)

    expect(textarea.value).toBe('')
    expect(screen.queryByText('Binary')).not.toBeInTheDocument()
  })

  it('clears output when switching modes', () => {
    render(<BinaryTextTool />)
    const textarea = screen.getByPlaceholderText('Enter text to encode...')

    fireEvent.change(textarea, { target: { value: 'Test' } })

    const encodeButtons = screen.getAllByRole('button', { name: /^encode$/i })
    fireEvent.click(encodeButtons[1])

    // Verify output is shown
    expect(screen.getByText('Binary')).toBeInTheDocument()

    // Switch to decode mode
    const decodeModeButtons = screen.getAllByRole('button', { name: /^decode$/i })
    fireEvent.click(decodeModeButtons[0])

    // Output should be cleared
    expect(screen.queryByDisplayValue(/01/)).not.toBeInTheDocument()
  })
})
