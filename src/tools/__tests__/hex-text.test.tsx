import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HexTextTool } from '../hex-text'

// Helper to get output textarea (the readonly one)
const getOutputTextarea = () => {
  const textareas = screen.getAllByRole('textbox')
  return textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
}

describe('HexTextTool', () => {
  it('renders without crashing', () => {
    render(<HexTextTool />)
    expect(screen.getByRole('button', { name: /Encode \(Text → Hex\)/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Decode \(Hex → Text\)/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Encode to Hex' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('defaults to encode mode', () => {
    render(<HexTextTool />)
    expect(screen.getByText('Text Input')).toBeInTheDocument()
    expect(screen.getByText('Hex Output')).toBeInTheDocument()
  })

  it('encodes text to hex', () => {
    render(<HexTextTool />)
    const textarea = screen.getByPlaceholderText('Enter text to encode to hex...')
    fireEvent.change(textarea, { target: { value: 'Hello' } })
    fireEvent.click(screen.getByRole('button', { name: 'Encode to Hex' }))

    const output = getOutputTextarea()
    expect(output).toHaveValue('48656c6c6f')
  })

  it('encodes text with special characters', () => {
    render(<HexTextTool />)
    const textarea = screen.getByPlaceholderText('Enter text to encode to hex...')
    fireEvent.change(textarea, { target: { value: 'Hello, World!' } })
    fireEvent.click(screen.getByRole('button', { name: 'Encode to Hex' }))

    const output = getOutputTextarea()
    expect(output).toHaveValue('48656c6c6f2c20576f726c6421')
  })

  it('switches to decode mode', () => {
    render(<HexTextTool />)
    fireEvent.click(screen.getByRole('button', { name: /Decode \(Hex → Text\)/ }))
    expect(screen.getByText('Hex Input')).toBeInTheDocument()
    expect(screen.getByText('Text Output')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Decode to Text' })).toBeInTheDocument()
  })

  it('decodes hex to text', () => {
    render(<HexTextTool />)
    fireEvent.click(screen.getByRole('button', { name: /Decode \(Hex → Text\)/ }))
    const textarea = screen.getByPlaceholderText(/Enter hex string to decode/)
    fireEvent.change(textarea, { target: { value: '48656c6c6f' } })
    fireEvent.click(screen.getByRole('button', { name: 'Decode to Text' }))

    const output = getOutputTextarea()
    expect(output).toHaveValue('Hello')
  })

  it('decodes hex with 0x prefix', () => {
    render(<HexTextTool />)
    fireEvent.click(screen.getByRole('button', { name: /Decode \(Hex → Text\)/ }))
    const textarea = screen.getByPlaceholderText(/Enter hex string to decode/)
    fireEvent.change(textarea, { target: { value: '0x48656c6c6f' } })
    fireEvent.click(screen.getByRole('button', { name: 'Decode to Text' }))

    const output = getOutputTextarea()
    expect(output).toHaveValue('Hello')
  })

  it('decodes hex with spaces', () => {
    render(<HexTextTool />)
    fireEvent.click(screen.getByRole('button', { name: /Decode \(Hex → Text\)/ }))
    const textarea = screen.getByPlaceholderText(/Enter hex string to decode/)
    fireEvent.change(textarea, { target: { value: '48 65 6c 6c 6f' } })
    fireEvent.click(screen.getByRole('button', { name: 'Decode to Text' }))

    const output = getOutputTextarea()
    expect(output).toHaveValue('Hello')
  })

  it('handles invalid hex string', () => {
    render(<HexTextTool />)
    fireEvent.click(screen.getByRole('button', { name: /Decode \(Hex → Text\)/ }))
    const textarea = screen.getByPlaceholderText(/Enter hex string to decode/)
    fireEvent.change(textarea, { target: { value: 'not valid hex gg' } })
    fireEvent.click(screen.getByRole('button', { name: 'Decode to Text' }))

    const output = getOutputTextarea()
    expect(output).toHaveValue('')
  })

  it('handles odd-length hex string', () => {
    render(<HexTextTool />)
    fireEvent.click(screen.getByRole('button', { name: /Decode \(Hex → Text\)/ }))
    const textarea = screen.getByPlaceholderText(/Enter hex string to decode/)
    fireEvent.change(textarea, { target: { value: '4865' } }) // Even length, valid
    fireEvent.click(screen.getByRole('button', { name: 'Decode to Text' }))

    let output = getOutputTextarea()
    expect(output).toHaveValue('He')

    fireEvent.change(textarea, { target: { value: '486' } }) // Odd length, invalid
    fireEvent.click(screen.getByRole('button', { name: 'Decode to Text' }))
    output = getOutputTextarea()
    expect(output).toHaveValue('')
  })

  it('resets the form', () => {
    render(<HexTextTool />)
    const textarea = screen.getByPlaceholderText('Enter text to encode to hex...')
    fireEvent.change(textarea, { target: { value: 'Hello' } })
    fireEvent.click(screen.getByRole('button', { name: 'Encode to Hex' }))
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(textarea).toHaveValue('')
    const output = getOutputTextarea()
    expect(output).toHaveValue('')
  })

  it('clears output when switching modes', () => {
    render(<HexTextTool />)
    const textarea = screen.getByPlaceholderText('Enter text to encode to hex...')
    fireEvent.change(textarea, { target: { value: 'Hello' } })
    fireEvent.click(screen.getByRole('button', { name: 'Encode to Hex' }))

    fireEvent.click(screen.getByRole('button', { name: /Decode \(Hex → Text\)/ }))
    const output = getOutputTextarea()
    expect(output).toHaveValue('')
  })
})
