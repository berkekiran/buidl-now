import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MorseCodeTool } from '../morse-code'

// Mock AudioContext
const mockAudioContext = {
  createOscillator: vi.fn(() => ({
    connect: vi.fn(),
    frequency: { value: 0 },
    type: 'sine',
    start: vi.fn(),
    stop: vi.fn(),
  })),
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
    },
  })),
  destination: {},
  currentTime: 0,
}

vi.stubGlobal('AudioContext', vi.fn(() => mockAudioContext))

describe('MorseCodeTool', () => {
  it('renders without crashing', () => {
    render(<MorseCodeTool />)
    expect(screen.getByText('Text to Morse')).toBeInTheDocument()
    expect(screen.getByText('Morse to Text')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('starts in encode mode', () => {
    render(<MorseCodeTool />)
    expect(screen.getAllByText('Text Input').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('button', { name: 'Convert to Morse' })).toBeInTheDocument()
  })

  it('converts text to Morse code', () => {
    render(<MorseCodeTool />)
    const input = screen.getByPlaceholderText(/Enter text to convert to Morse code/)
    const convertButton = screen.getByRole('button', { name: 'Convert to Morse' })

    fireEvent.change(input, { target: { value: 'SOS' } })
    fireEvent.click(convertButton)

    expect(screen.getByText('Morse Code Output')).toBeInTheDocument()
    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    // SOS = ... --- ...
    expect(outputTextarea?.value).toBe('... --- ...')
  })

  it('switches to decode mode', () => {
    render(<MorseCodeTool />)
    const decodeButton = screen.getByText('Morse to Text')

    fireEvent.click(decodeButton)

    expect(screen.getByText('Morse Code Input')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Convert to Text' })).toBeInTheDocument()
  })

  it('converts Morse code to text', () => {
    render(<MorseCodeTool />)

    // Switch to decode mode
    const decodeModeButton = screen.getByText('Morse to Text')
    fireEvent.click(decodeModeButton)

    const input = screen.getByPlaceholderText(/Enter Morse code/)
    fireEvent.change(input, { target: { value: '... --- ...' } })

    const convertButton = screen.getByRole('button', { name: 'Convert to Text' })
    fireEvent.click(convertButton)

    expect(screen.getByText('Text Output')).toBeInTheDocument()
    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toBe('SOS')
  })

  it('handles spaces between words', () => {
    render(<MorseCodeTool />)
    const input = screen.getByPlaceholderText(/Enter text to convert to Morse code/)
    const convertButton = screen.getByRole('button', { name: 'Convert to Morse' })

    fireEvent.change(input, { target: { value: 'HI MOM' } })
    fireEvent.click(convertButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    // Space between words is represented as /
    expect(outputTextarea?.value).toContain('/')
  })

  it('decodes Morse code with word separators', () => {
    render(<MorseCodeTool />)

    // Switch to decode mode
    const decodeModeButton = screen.getByText('Morse to Text')
    fireEvent.click(decodeModeButton)

    const input = screen.getByPlaceholderText(/Enter Morse code/)
    // "HI MOM" in Morse
    fireEvent.change(input, { target: { value: '.... .. / -- --- --' } })

    const convertButton = screen.getByRole('button', { name: 'Convert to Text' })
    fireEvent.click(convertButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toBe('HI MOM')
  })

  it('handles numbers in Morse code', () => {
    render(<MorseCodeTool />)
    const input = screen.getByPlaceholderText(/Enter text to convert to Morse code/)
    const convertButton = screen.getByRole('button', { name: 'Convert to Morse' })

    fireEvent.change(input, { target: { value: '123' } })
    fireEvent.click(convertButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    // 1 = .---- 2 = ..--- 3 = ...--
    expect(outputTextarea?.value).toBe('.---- ..--- ...--')
  })

  it('shows Morse code reference section', () => {
    render(<MorseCodeTool />)
    expect(screen.getByText('Morse Code Reference')).toBeInTheDocument()
  })

  it('resets all fields when reset button is clicked', () => {
    render(<MorseCodeTool />)
    const input = screen.getByPlaceholderText(/Enter text to convert to Morse code/) as HTMLTextAreaElement
    const convertButton = screen.getByRole('button', { name: 'Convert to Morse' })

    fireEvent.change(input, { target: { value: 'SOS' } })
    fireEvent.click(convertButton)

    expect(screen.getByText('Morse Code Output')).toBeInTheDocument()

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(input.value).toBe('')
    expect(screen.queryByText('Morse Code Output')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<MorseCodeTool />)
    const convertButton = screen.getByRole('button', { name: 'Convert to Morse' })

    fireEvent.click(convertButton)

    // Should not show output for empty input
    expect(screen.queryByText('Morse Code Output')).not.toBeInTheDocument()
  })

  it('clears output when switching modes', () => {
    render(<MorseCodeTool />)
    const input = screen.getByPlaceholderText(/Enter text to convert to Morse code/)
    const convertButton = screen.getByRole('button', { name: 'Convert to Morse' })

    fireEvent.change(input, { target: { value: 'SOS' } })
    fireEvent.click(convertButton)

    expect(screen.getByText('Morse Code Output')).toBeInTheDocument()

    // Switch to decode mode
    const decodeModeButton = screen.getByText('Morse to Text')
    fireEvent.click(decodeModeButton)

    // Output should be cleared
    expect(screen.queryByText('Morse Code Output')).not.toBeInTheDocument()
  })

  it('shows play audio button when output is available in encode mode', () => {
    render(<MorseCodeTool />)
    const input = screen.getByPlaceholderText(/Enter text to convert to Morse code/)
    const convertButton = screen.getByRole('button', { name: 'Convert to Morse' })

    fireEvent.change(input, { target: { value: 'SOS' } })
    fireEvent.click(convertButton)

    expect(screen.getByRole('button', { name: 'Play Audio' })).toBeInTheDocument()
  })

  it('handles unknown characters gracefully', () => {
    render(<MorseCodeTool />)

    // Switch to decode mode
    const decodeModeButton = screen.getByText('Morse to Text')
    fireEvent.click(decodeModeButton)

    const input = screen.getByPlaceholderText(/Enter Morse code/)
    // Invalid Morse sequence
    fireEvent.change(input, { target: { value: '.........' } })

    const convertButton = screen.getByRole('button', { name: 'Convert to Text' })
    fireEvent.click(convertButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    // Unknown characters are replaced with ?
    expect(outputTextarea?.value).toContain('?')
  })

  it('converts lowercase to uppercase', () => {
    render(<MorseCodeTool />)
    const input = screen.getByPlaceholderText(/Enter text to convert to Morse code/)
    const convertButton = screen.getByRole('button', { name: 'Convert to Morse' })

    fireEvent.change(input, { target: { value: 'sos' } })
    fireEvent.click(convertButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    // Should be the same as uppercase SOS
    expect(outputTextarea?.value).toBe('... --- ...')
  })
})
