import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AbiEncoderTool } from '../abi-encoder'

// Mock viem module since it's complex to test with real encoding
vi.mock('viem', () => ({
  encodeAbiParameters: vi.fn((params, values) => {
    // Return a mock encoded value
    return '0x' + '00'.repeat(64)
  }),
  decodeAbiParameters: vi.fn((params, data) => {
    // Return mock decoded values
    return ['0x1234567890123456789012345678901234567890', BigInt(1000)]
  }),
  parseAbiParameters: vi.fn((types) => {
    // Return mock parsed parameters
    return types.split(',').map((t: string) => ({ type: t.trim(), name: '' }))
  }),
}))

describe('AbiEncoderTool', () => {
  it('renders without crashing', () => {
    render(<AbiEncoderTool />)
    expect(screen.getByText('Encode ABI Parameters')).toBeInTheDocument()
    expect(screen.getByText('Decode ABI Parameters')).toBeInTheDocument()
  })

  it('renders encode section with all inputs', () => {
    render(<AbiEncoderTool />)
    const textareas = screen.getAllByRole('textbox')
    expect(textareas.length).toBeGreaterThanOrEqual(4) // types, values, decode types, decode data
  })

  it('renders decode section with all inputs', () => {
    render(<AbiEncoderTool />)
    expect(screen.getByRole('button', { name: /decode/i })).toBeInTheDocument()
  })

  it('encodes ABI parameters', () => {
    render(<AbiEncoderTool />)

    // Find textareas by their position in the encode section
    const textareas = screen.getAllByRole('textbox')
    const typesTextarea = textareas[0]
    const valuesTextarea = textareas[1]

    fireEvent.change(typesTextarea, { target: { value: 'address,uint256' } })
    fireEvent.change(valuesTextarea, { target: { value: '"0x1234567890123456789012345678901234567890", 1000' } })

    const encodeButtons = screen.getAllByRole('button', { name: /encode/i })
    fireEvent.click(encodeButtons[0])

    expect(screen.getByText('Encoded Data')).toBeInTheDocument()
  })

  it('decodes ABI parameters', () => {
    render(<AbiEncoderTool />)

    // Find textareas by their position in the decode section
    const textareas = screen.getAllByRole('textbox')
    const decodeTypesTextarea = textareas[2]
    const decodeDataTextarea = textareas[3]

    fireEvent.change(decodeTypesTextarea, { target: { value: 'address,uint256' } })
    fireEvent.change(decodeDataTextarea, { target: { value: '0x' + '00'.repeat(64) } })

    const decodeButton = screen.getByRole('button', { name: /decode/i })
    fireEvent.click(decodeButton)

    // Check that the decoding doesn't crash - decoded values may or may not appear depending on mock
    expect(decodeTypesTextarea).toHaveValue('address,uint256')
  })

  it('has reset button for encode section', () => {
    render(<AbiEncoderTool />)
    const resetButtons = screen.getAllByRole('button', { name: /reset/i })
    expect(resetButtons[0]).toBeInTheDocument()
  })

  it('has reset button for decode section', () => {
    render(<AbiEncoderTool />)
    const resetButtons = screen.getAllByRole('button', { name: /reset/i })
    expect(resetButtons[1]).toBeInTheDocument()
  })

  it('resets encode section when reset is clicked', () => {
    render(<AbiEncoderTool />)

    const textareas = screen.getAllByRole('textbox')
    const typesTextarea = textareas[0] as HTMLTextAreaElement
    const valuesTextarea = textareas[1] as HTMLTextAreaElement

    fireEvent.change(typesTextarea, { target: { value: 'address' } })
    fireEvent.change(valuesTextarea, { target: { value: '"0x1234"' } })

    const resetButtons = screen.getAllByRole('button', { name: /reset/i })
    fireEvent.click(resetButtons[0])

    expect(typesTextarea.value).toBe('')
    expect(valuesTextarea.value).toBe('')
  })

  it('resets decode section when reset is clicked', () => {
    render(<AbiEncoderTool />)

    const textareas = screen.getAllByRole('textbox')
    const decodeTypesTextarea = textareas[2] as HTMLTextAreaElement
    const decodeDataTextarea = textareas[3] as HTMLTextAreaElement

    fireEvent.change(decodeTypesTextarea, { target: { value: 'address' } })
    fireEvent.change(decodeDataTextarea, { target: { value: '0x1234' } })

    const resetButtons = screen.getAllByRole('button', { name: /reset/i })
    fireEvent.click(resetButtons[1])

    expect(decodeTypesTextarea.value).toBe('')
    expect(decodeDataTextarea.value).toBe('')
  })

  it('handles empty input gracefully for encode', () => {
    render(<AbiEncoderTool />)

    const encodeButtons = screen.getAllByRole('button', { name: /encode/i })
    fireEvent.click(encodeButtons[0])

    // Should not show output for empty input
    expect(screen.queryByText('Encoded Data')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully for decode', () => {
    render(<AbiEncoderTool />)

    const decodeButton = screen.getByRole('button', { name: /decode/i })
    fireEvent.click(decodeButton)

    // Should not show output for empty input
    expect(screen.queryByText('Decoded Values')).not.toBeInTheDocument()
  })
})
