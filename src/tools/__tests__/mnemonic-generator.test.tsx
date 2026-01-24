import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MnemonicGeneratorTool } from '../mnemonic-generator'

// Helper to get output textarea (readonly one after generation)
const getOutputTextarea = () => {
  const textareas = screen.getAllByRole('textbox')
  return textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
}

describe('MnemonicGeneratorTool', () => {
  it('renders without crashing', () => {
    render(<MnemonicGeneratorTool />)
    expect(screen.getByText('Mode')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Generate' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Validate' })).toBeInTheDocument()
  })

  it('shows security warning', () => {
    render(<MnemonicGeneratorTool />)
    expect(screen.getByText('Security Warning')).toBeInTheDocument()
    expect(screen.getByText(/Never share your mnemonic phrase with anyone/)).toBeInTheDocument()
  })

  it('defaults to generate mode', () => {
    render(<MnemonicGeneratorTool />)
    expect(screen.getByText('Word Count')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '12 Words' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '24 Words' })).toBeInTheDocument()
  })

  it('generates 12-word mnemonic', () => {
    render(<MnemonicGeneratorTool />)
    fireEvent.click(screen.getByRole('button', { name: 'Generate Mnemonic' }))

    const textarea = getOutputTextarea()
    const words = textarea?.value?.split(' ') || []
    expect(words.length).toBe(12)
  })

  it('generates 24-word mnemonic', () => {
    render(<MnemonicGeneratorTool />)
    fireEvent.click(screen.getByRole('button', { name: '24 Words' }))
    fireEvent.click(screen.getByRole('button', { name: 'Generate Mnemonic' }))

    const textarea = getOutputTextarea()
    const words = textarea?.value?.split(' ') || []
    expect(words.length).toBe(24)
  })

  it('switches to validate mode', () => {
    render(<MnemonicGeneratorTool />)
    fireEvent.click(screen.getByRole('button', { name: 'Validate' }))
    expect(screen.getByText('Mnemonic Phrase to Validate')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Validate Mnemonic' })).toBeInTheDocument()
  })

  it('shows error for empty mnemonic validation', () => {
    render(<MnemonicGeneratorTool />)
    fireEvent.click(screen.getByRole('button', { name: 'Validate' }))
    fireEvent.click(screen.getByRole('button', { name: 'Validate Mnemonic' }))
    expect(screen.getByText(/Please enter a mnemonic phrase/)).toBeInTheDocument()
  })

  it('shows error for invalid word count', () => {
    render(<MnemonicGeneratorTool />)
    fireEvent.click(screen.getByRole('button', { name: 'Validate' }))
    const textarea = screen.getByPlaceholderText('word1 word2 word3 word4 ...')
    fireEvent.change(textarea, { target: { value: 'one two three' } })
    fireEvent.click(screen.getByRole('button', { name: 'Validate Mnemonic' }))
    expect(screen.getByText(/Invalid word count/)).toBeInTheDocument()
  })

  it('resets the form in validate mode', () => {
    render(<MnemonicGeneratorTool />)
    fireEvent.click(screen.getByRole('button', { name: 'Validate' }))
    const textarea = screen.getByPlaceholderText('word1 word2 word3 word4 ...')
    fireEvent.change(textarea, { target: { value: 'test phrase' } })
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(textarea).toHaveValue('')
  })

  it('shows info box about BIP39', () => {
    render(<MnemonicGeneratorTool />)
    expect(screen.getByText(/About BIP39:/)).toBeInTheDocument()
  })
})
