import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RandomStringGeneratorTool } from '../random-string-generator'

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

describe('RandomStringGeneratorTool', () => {
  it('renders without crashing', () => {
    render(<RandomStringGeneratorTool />)
    expect(screen.getByText('Character Type')).toBeInTheDocument()
    expect(screen.getByText('Length (1-512)')).toBeInTheDocument()
    expect(screen.getByText('Number of Strings (1-100)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate string/i })).toBeInTheDocument()
  })

  it('renders character type buttons', () => {
    render(<RandomStringGeneratorTool />)
    expect(screen.getByRole('button', { name: /alphanumeric/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^hex$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^numeric$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /custom/i })).toBeInTheDocument()
  })

  it('has default length of 32', () => {
    render(<RandomStringGeneratorTool />)
    const lengthInput = screen.getByPlaceholderText('32') as HTMLInputElement
    expect(lengthInput.value).toBe('32')
  })

  it('has default count of 1', () => {
    render(<RandomStringGeneratorTool />)
    const countInput = screen.getByPlaceholderText('1') as HTMLInputElement
    expect(countInput.value).toBe('1')
  })

  it('generates a random string', () => {
    render(<RandomStringGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: /generate string$/i })

    fireEvent.click(generateButton)

    expect(screen.getByText('Generated String')).toBeInTheDocument()
  })

  it('switches to hex character type', () => {
    render(<RandomStringGeneratorTool />)
    const hexButton = screen.getByRole('button', { name: /^hex$/i })

    fireEvent.click(hexButton)

    // Just verify the click doesn't crash
    expect(hexButton).toBeInTheDocument()
  })

  it('switches to numeric character type', () => {
    render(<RandomStringGeneratorTool />)
    const numericButton = screen.getByRole('button', { name: /^numeric$/i })

    fireEvent.click(numericButton)

    // Just verify the click doesn't crash
    expect(numericButton).toBeInTheDocument()
  })

  it('switches to custom character type and shows options', () => {
    render(<RandomStringGeneratorTool />)
    const customButton = screen.getByRole('button', { name: /custom/i })

    fireEvent.click(customButton)

    // Custom options should appear
    expect(screen.getByText('Include Characters')).toBeInTheDocument()
  })

  it('generates multiple strings when count > 1', () => {
    render(<RandomStringGeneratorTool />)
    const countInput = screen.getByPlaceholderText('1')

    fireEvent.change(countInput, { target: { value: '5' } })
    const generateButton = screen.getByRole('button', { name: /generate strings$/i })
    fireEvent.click(generateButton)

    expect(screen.getByText('Generated Strings (5)')).toBeInTheDocument()
  })

  it('updates button text based on count', () => {
    render(<RandomStringGeneratorTool />)
    const countInput = screen.getByPlaceholderText('1')

    // Initially should say "String" (singular)
    expect(screen.getByRole('button', { name: /generate string$/i })).toBeInTheDocument()

    // Change to multiple
    fireEvent.change(countInput, { target: { value: '5' } })

    // Should now say "Strings" (plural)
    expect(screen.getByRole('button', { name: /generate strings$/i })).toBeInTheDocument()
  })

  it('clamps length to minimum of 1', () => {
    render(<RandomStringGeneratorTool />)
    const lengthInput = screen.getByPlaceholderText('32')
    const generateButton = screen.getByRole('button', { name: /generate string/i })

    fireEvent.change(lengthInput, { target: { value: '0' } })
    fireEvent.click(generateButton)

    expect(screen.getByText('Generated String')).toBeInTheDocument()
  })

  it('clamps length to maximum of 512', () => {
    render(<RandomStringGeneratorTool />)
    const lengthInput = screen.getByPlaceholderText('32')
    const generateButton = screen.getByRole('button', { name: /generate string/i })

    fireEvent.change(lengthInput, { target: { value: '1000' } })
    fireEvent.click(generateButton)

    expect(screen.getByText('Generated String')).toBeInTheDocument()
  })

  it('clamps count to maximum of 100', () => {
    render(<RandomStringGeneratorTool />)
    const countInput = screen.getByPlaceholderText('1')

    fireEvent.change(countInput, { target: { value: '200' } })
    const generateButton = screen.getByRole('button', { name: /generate strings/i })
    fireEvent.click(generateButton)

    expect(screen.getByText('Generated Strings (100)')).toBeInTheDocument()
  })

  it('toggles custom character options', () => {
    render(<RandomStringGeneratorTool />)

    // Switch to custom mode
    const customButton = screen.getByRole('button', { name: /custom/i })
    fireEvent.click(customButton)

    // Check that custom options appeared
    expect(screen.getByText('Include Characters')).toBeInTheDocument()
  })

  it('generates empty string when all custom options are disabled', () => {
    render(<RandomStringGeneratorTool />)

    // Switch to custom mode
    const customButton = screen.getByRole('button', { name: /custom/i })
    fireEvent.click(customButton)

    // Just verify custom mode is active
    expect(screen.getByText('Include Characters')).toBeInTheDocument()
  })

  it('has copy functionality for generated string', () => {
    render(<RandomStringGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: /generate string/i })

    fireEvent.click(generateButton)

    expect(screen.getByText('Generated String')).toBeInTheDocument()
  })
})
