import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AddressChecksumTool } from '../address-checksum'

describe('AddressChecksumTool', () => {
  it('renders without crashing', () => {
    render(<AddressChecksumTool />)
    expect(screen.getByText('Ethereum Address')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Convert to Checksum' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays placeholder text', () => {
    render(<AddressChecksumTool />)
    expect(screen.getByPlaceholderText('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')).toBeInTheDocument()
  })

  it('converts lowercase address to checksum format', () => {
    render(<AddressChecksumTool />)
    const input = screen.getByPlaceholderText('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
    const convertButton = screen.getByRole('button', { name: 'Convert to Checksum' })

    fireEvent.change(input, { target: { value: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045' } })
    fireEvent.click(convertButton)

    expect(screen.getByDisplayValue('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBeInTheDocument()
    expect(screen.getByText(/Converted to checksum format/)).toBeInTheDocument()
  })

  it('recognizes already checksummed addresses', () => {
    render(<AddressChecksumTool />)
    const input = screen.getByPlaceholderText('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
    const convertButton = screen.getByRole('button', { name: 'Convert to Checksum' })

    fireEvent.change(input, { target: { value: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' } })
    fireEvent.click(convertButton)

    expect(screen.getByText(/Already in correct checksum format/)).toBeInTheDocument()
  })

  it('shows error for invalid address', () => {
    render(<AddressChecksumTool />)
    const input = screen.getByPlaceholderText('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
    const convertButton = screen.getByRole('button', { name: 'Convert to Checksum' })

    fireEvent.change(input, { target: { value: '0xinvalid' } })
    fireEvent.click(convertButton)

    expect(screen.getByText(/Invalid Ethereum Address/)).toBeInTheDocument()
  })

  it('resets all fields when reset button is clicked', () => {
    render(<AddressChecksumTool />)
    const input = screen.getByPlaceholderText('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
    const convertButton = screen.getByRole('button', { name: 'Convert to Checksum' })

    fireEvent.change(input, { target: { value: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045' } })
    fireEvent.click(convertButton)

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(input).toHaveValue('')
    expect(screen.queryByText(/Checksum Address/)).not.toBeInTheDocument()
  })

  it('clears previous state when input changes', () => {
    render(<AddressChecksumTool />)
    const input = screen.getByPlaceholderText('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
    const convertButton = screen.getByRole('button', { name: 'Convert to Checksum' })

    // First convert
    fireEvent.change(input, { target: { value: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045' } })
    fireEvent.click(convertButton)

    expect(screen.getByText(/Converted to checksum format/)).toBeInTheDocument()

    // Change input
    fireEvent.change(input, { target: { value: '0x123' } })

    // Status should be cleared
    expect(screen.queryByText(/Converted to checksum format/)).not.toBeInTheDocument()
  })

  it('handles uppercase address', () => {
    render(<AddressChecksumTool />)
    const input = screen.getByPlaceholderText('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
    const convertButton = screen.getByRole('button', { name: 'Convert to Checksum' })

    fireEvent.change(input, { target: { value: '0xD8DA6BF26964AF9D7EED9E03E53415D37AA96045' } })
    fireEvent.click(convertButton)

    // Should still convert to proper checksum format
    expect(screen.getByDisplayValue('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<AddressChecksumTool />)
    const convertButton = screen.getByRole('button', { name: 'Convert to Checksum' })

    fireEvent.click(convertButton)

    // Should not show any validation message
    expect(screen.queryByText(/Invalid Ethereum Address/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Converted to checksum format/)).not.toBeInTheDocument()
  })
})
