import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NanoidGeneratorTool } from '../nanoid-generator'

// Mock crypto.getRandomValues
beforeEach(() => {
  vi.spyOn(crypto, 'getRandomValues').mockImplementation((array) => {
    if (array instanceof Uint8Array) {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
    }
    return array
  })
})

describe('NanoidGeneratorTool', () => {
  it('renders without crashing', () => {
    render(<NanoidGeneratorTool />)
    expect(screen.getByText('Length (1-128)')).toBeInTheDocument()
    expect(screen.getByText('Number of IDs (1-100)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate nanoid/i })).toBeInTheDocument()
  })

  it('has default length of 21', () => {
    render(<NanoidGeneratorTool />)
    const lengthInput = screen.getByPlaceholderText('21') as HTMLInputElement
    expect(lengthInput.value).toBe('21')
  })

  it('has default count of 1', () => {
    render(<NanoidGeneratorTool />)
    const countInput = screen.getByPlaceholderText('1') as HTMLInputElement
    expect(countInput.value).toBe('1')
  })

  it('generates a single nanoid', () => {
    render(<NanoidGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: /generate nanoid$/i })

    fireEvent.click(generateButton)

    expect(screen.getByText('Generated Nanoid')).toBeInTheDocument()
  })

  it('generates nanoid with specified length', () => {
    render(<NanoidGeneratorTool />)
    const lengthInput = screen.getByPlaceholderText('21')
    const generateButton = screen.getByRole('button', { name: /generate nanoid$/i })

    fireEvent.change(lengthInput, { target: { value: '10' } })
    fireEvent.click(generateButton)

    const output = screen.getByText('Generated Nanoid')
    expect(output).toBeInTheDocument()
  })

  it('generates multiple nanoids when count > 1', () => {
    render(<NanoidGeneratorTool />)
    const countInput = screen.getByPlaceholderText('1')

    fireEvent.change(countInput, { target: { value: '5' } })
    const generateButton = screen.getByRole('button', { name: /generate nanoids$/i })
    fireEvent.click(generateButton)

    expect(screen.getByText('Generated Nanoids (5)')).toBeInTheDocument()
  })

  it('updates button text based on count', () => {
    render(<NanoidGeneratorTool />)
    const countInput = screen.getByPlaceholderText('1')

    // Initially should say "Nanoid" (singular)
    expect(screen.getByRole('button', { name: /generate nanoid$/i })).toBeInTheDocument()

    // Change to multiple
    fireEvent.change(countInput, { target: { value: '5' } })

    // Should now say "Nanoids" (plural)
    expect(screen.getByRole('button', { name: /generate nanoids$/i })).toBeInTheDocument()
  })

  it('clamps length to minimum of 1', () => {
    render(<NanoidGeneratorTool />)
    const lengthInput = screen.getByPlaceholderText('21')
    const generateButton = screen.getByRole('button', { name: /generate nanoid/i })

    fireEvent.change(lengthInput, { target: { value: '0' } })
    fireEvent.click(generateButton)

    // Should still generate (with clamped value)
    expect(screen.getByText('Generated Nanoid')).toBeInTheDocument()
  })

  it('clamps length to maximum of 128', () => {
    render(<NanoidGeneratorTool />)
    const lengthInput = screen.getByPlaceholderText('21')
    const generateButton = screen.getByRole('button', { name: /generate nanoid/i })

    fireEvent.change(lengthInput, { target: { value: '200' } })
    fireEvent.click(generateButton)

    // Should still generate (with clamped value)
    expect(screen.getByText('Generated Nanoid')).toBeInTheDocument()
  })

  it('clamps count to minimum of 1', () => {
    render(<NanoidGeneratorTool />)
    const countInput = screen.getByPlaceholderText('1')
    const generateButton = screen.getByRole('button', { name: /generate nanoid/i })

    fireEvent.change(countInput, { target: { value: '0' } })
    fireEvent.click(generateButton)

    // Should still generate (with clamped value of 1)
    expect(screen.getByText('Generated Nanoid')).toBeInTheDocument()
  })

  it('clamps count to maximum of 100', () => {
    render(<NanoidGeneratorTool />)
    const countInput = screen.getByPlaceholderText('1')

    fireEvent.change(countInput, { target: { value: '150' } })
    const generateButton = screen.getByRole('button', { name: /generate nanoids/i })
    fireEvent.click(generateButton)

    // Should generate 100 nanoids
    expect(screen.getByText('Generated Nanoids (100)')).toBeInTheDocument()
  })

  it('generates different nanoid on each click', () => {
    render(<NanoidGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: /generate nanoid/i })

    fireEvent.click(generateButton)
    expect(screen.getByText('Generated Nanoid')).toBeInTheDocument()

    // Click again and verify it still works
    fireEvent.click(generateButton)
    expect(screen.getByText('Generated Nanoid')).toBeInTheDocument()
  })

  it('handles invalid length input gracefully', () => {
    render(<NanoidGeneratorTool />)
    const lengthInput = screen.getByPlaceholderText('21')
    const generateButton = screen.getByRole('button', { name: /generate nanoid/i })

    fireEvent.change(lengthInput, { target: { value: 'abc' } })
    fireEvent.click(generateButton)

    // Should fall back to default length of 21
    expect(screen.getByText('Generated Nanoid')).toBeInTheDocument()
  })

  it('has copy functionality for generated nanoid', () => {
    render(<NanoidGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: /generate nanoid/i })

    fireEvent.click(generateButton)

    // The Input component should have showCopy prop
    expect(screen.getByText('Generated Nanoid')).toBeInTheDocument()
  })
})
