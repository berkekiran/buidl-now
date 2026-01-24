import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ContractStorageSlotTool } from '../contract-storage-slot'

describe('ContractStorageSlotTool', () => {
  it('renders without crashing', () => {
    render(<ContractStorageSlotTool />)
    expect(screen.getByText(/mapping key/i)).toBeInTheDocument()
    expect(screen.getByText(/storage slot number/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument()
  })

  it('has inputs for mapping key and slot number', () => {
    render(<ContractStorageSlotTool />)
    expect(screen.getByPlaceholderText(/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('0')).toBeInTheDocument()
  })

  it('calculates storage slot for address key', () => {
    render(<ContractStorageSlotTool />)

    const keyInput = screen.getByPlaceholderText(/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045/i)
    const slotInput = screen.getByPlaceholderText('0')

    fireEvent.change(keyInput, { target: { value: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' } })
    fireEvent.change(slotInput, { target: { value: '0' } })

    const calculateButton = screen.getByRole('button', { name: /calculate/i })
    fireEvent.click(calculateButton)

    expect(screen.getByText('Storage Slot')).toBeInTheDocument()
    // The storage slot should be a 66-character hex string (0x + 64 chars)
    const outputs = document.querySelectorAll('input[readonly]')
    const storageSlotOutput = Array.from(outputs).find(
      input => (input as HTMLInputElement).value.startsWith('0x') && (input as HTMLInputElement).value.length === 66
    )
    expect(storageSlotOutput).toBeTruthy()
  })

  it('calculates storage slot for numeric key', () => {
    render(<ContractStorageSlotTool />)

    const keyInput = screen.getByPlaceholderText(/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045/i)
    const slotInput = screen.getByPlaceholderText('0')

    fireEvent.change(keyInput, { target: { value: '123' } })
    fireEvent.change(slotInput, { target: { value: '2' } })

    const calculateButton = screen.getByRole('button', { name: /calculate/i })
    fireEvent.click(calculateButton)

    expect(screen.getByText('Storage Slot')).toBeInTheDocument()
  })

  it('handles reset correctly', () => {
    render(<ContractStorageSlotTool />)

    const keyInput = screen.getByPlaceholderText(/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045/i)
    const slotInput = screen.getByPlaceholderText('0')

    fireEvent.change(keyInput, { target: { value: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' } })
    fireEvent.change(slotInput, { target: { value: '0' } })

    const calculateButton = screen.getByRole('button', { name: /calculate/i })
    fireEvent.click(calculateButton)

    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)

    expect(keyInput).toHaveValue('')
    expect(slotInput).toHaveValue('')
    expect(screen.queryByText('Storage Slot')).not.toBeInTheDocument()
  })

  it('does not calculate with empty inputs', () => {
    render(<ContractStorageSlotTool />)

    const calculateButton = screen.getByRole('button', { name: /calculate/i })
    fireEvent.click(calculateButton)

    expect(screen.queryByText('Storage Slot')).not.toBeInTheDocument()
  })

  it('shows usage example with viem code', () => {
    render(<ContractStorageSlotTool />)

    const keyInput = screen.getByPlaceholderText(/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045/i)
    const slotInput = screen.getByPlaceholderText('0')

    fireEvent.change(keyInput, { target: { value: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' } })
    fireEvent.change(slotInput, { target: { value: '0' } })

    const calculateButton = screen.getByRole('button', { name: /calculate/i })
    fireEvent.click(calculateButton)

    expect(screen.getByText(/how to use with eth_getstorageat/i)).toBeInTheDocument()
  })
})
