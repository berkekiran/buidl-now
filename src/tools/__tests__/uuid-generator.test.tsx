import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { UuidGeneratorTool } from '../uuid-generator'

// UUID v4 format regex
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('UuidGeneratorTool', () => {
  it('renders without crashing', () => {
    render(<UuidGeneratorTool />)
    expect(screen.getByText('Number of UUIDs (1-100)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Generate UUID/ })).toBeInTheDocument()
  })

  it('displays count input with default value', () => {
    render(<UuidGeneratorTool />)
    const countInput = screen.getByPlaceholderText('1')
    expect(countInput).toHaveValue(1)
  })

  it('generates a single UUID', () => {
    render(<UuidGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: /Generate UUID/ })

    fireEvent.click(generateButton)

    expect(screen.getByText('Generated UUID (v4)')).toBeInTheDocument()
    const uuidInput = screen.getByRole('textbox', { hidden: false })
    // Just check the format of the UUID shown in the readonly input
    const inputs = screen.getAllByRole('textbox')
    const uuidValue = inputs.find(input => {
      const value = (input as HTMLInputElement).value
      return UUID_V4_REGEX.test(value)
    })
    expect(uuidValue).toBeDefined()
  })

  it('generates a valid UUID v4 format', () => {
    render(<UuidGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: /Generate UUID/ })

    fireEvent.click(generateButton)

    const inputs = screen.getAllByRole('textbox')
    const uuidInput = inputs.find(input => input.hasAttribute('readonly'))
    if (uuidInput) {
      const value = (uuidInput as HTMLInputElement).value
      expect(value).toMatch(UUID_V4_REGEX)
    }
  })

  it('generates multiple UUIDs when count is greater than 1', () => {
    render(<UuidGeneratorTool />)
    const countInput = screen.getByPlaceholderText('1')
    const generateButton = screen.getByRole('button', { name: /Generate UUID/ })

    fireEvent.change(countInput, { target: { value: '5' } })
    fireEvent.click(generateButton)

    expect(screen.getByText('Generated UUIDs (5)')).toBeInTheDocument()
  })

  it('limits count to maximum of 100', () => {
    render(<UuidGeneratorTool />)
    const countInput = screen.getByPlaceholderText('1')
    const generateButton = screen.getByRole('button', { name: /Generate UUID/ })

    fireEvent.change(countInput, { target: { value: '150' } })
    fireEvent.click(generateButton)

    // Should only generate 100
    expect(screen.getByText('Generated UUIDs (100)')).toBeInTheDocument()
  })

  it('limits count to minimum of 1', () => {
    render(<UuidGeneratorTool />)
    const countInput = screen.getByPlaceholderText('1')
    const generateButton = screen.getByRole('button', { name: /Generate UUID/ })

    fireEvent.change(countInput, { target: { value: '0' } })
    fireEvent.click(generateButton)

    // Should generate 1
    expect(screen.getByText('Generated UUID (v4)')).toBeInTheDocument()
  })

  it('handles invalid count input', () => {
    render(<UuidGeneratorTool />)
    const countInput = screen.getByPlaceholderText('1')
    const generateButton = screen.getByRole('button', { name: /Generate UUID/ })

    fireEvent.change(countInput, { target: { value: 'abc' } })
    fireEvent.click(generateButton)

    // Should default to 1
    expect(screen.getByText('Generated UUID (v4)')).toBeInTheDocument()
  })

  it('changes button text based on count', () => {
    render(<UuidGeneratorTool />)
    const countInput = screen.getByPlaceholderText('1')

    expect(screen.getByRole('button', { name: 'Generate UUID' })).toBeInTheDocument()

    fireEvent.change(countInput, { target: { value: '5' } })

    expect(screen.getByRole('button', { name: 'Generate UUIDs' })).toBeInTheDocument()
  })

  it('generates different UUIDs on each click', () => {
    render(<UuidGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: /Generate UUID/ })

    fireEvent.click(generateButton)
    const inputs1 = screen.getAllByRole('textbox')
    const uuid1 = inputs1.find(input => input.hasAttribute('readonly'))?.getAttribute('value')

    fireEvent.click(generateButton)
    const inputs2 = screen.getAllByRole('textbox')
    const uuid2 = inputs2.find(input => input.hasAttribute('readonly'))?.getAttribute('value')

    // UUIDs should be different (extremely unlikely to be the same)
    expect(uuid1).not.toBe(uuid2)
  })
})
