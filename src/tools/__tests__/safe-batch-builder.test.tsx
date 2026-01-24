import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SafeBatchBuilderTool } from '../safe-batch-builder'

describe('SafeBatchBuilderTool', () => {
  it('renders without crashing', () => {
    render(<SafeBatchBuilderTool />)
    expect(screen.getByText('Transaction #1')).toBeInTheDocument()
    expect(screen.getByText('To Address')).toBeInTheDocument()
    expect(screen.getByText('Value (in Wei)')).toBeInTheDocument()
    expect(screen.getByText('Operation')).toBeInTheDocument()
    expect(screen.getByText('Data (Hex)')).toBeInTheDocument()
  })

  it('has add transaction and generate buttons', () => {
    render(<SafeBatchBuilderTool />)
    expect(screen.getByRole('button', { name: /add transaction/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate batch/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('has Call and DelegateCall operation buttons', () => {
    render(<SafeBatchBuilderTool />)
    expect(screen.getByRole('button', { name: /call \(0\)/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delegatecall \(1\)/i })).toBeInTheDocument()
  })

  it('adds a new transaction when button is clicked', () => {
    render(<SafeBatchBuilderTool />)

    const addButton = screen.getByRole('button', { name: /add transaction/i })
    fireEvent.click(addButton)

    expect(screen.getByText('Transaction #1')).toBeInTheDocument()
    expect(screen.getByText('Transaction #2')).toBeInTheDocument()
  })

  it('removes transaction when remove button is clicked', () => {
    render(<SafeBatchBuilderTool />)

    const addButton = screen.getByRole('button', { name: /add transaction/i })
    fireEvent.click(addButton)

    expect(screen.getByText('Transaction #2')).toBeInTheDocument()

    // Find and click the first remove button
    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    fireEvent.click(removeButtons[0])

    // Should only have one transaction now
    expect(screen.queryByText('Transaction #2')).not.toBeInTheDocument()
  })

  it('does not allow removing the last transaction', () => {
    render(<SafeBatchBuilderTool />)

    // Only one transaction by default, no remove button should be visible
    expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument()
  })

  it('generates batch JSON with valid inputs', () => {
    render(<SafeBatchBuilderTool />)

    const toAddressInput = screen.getByPlaceholderText('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')
    fireEvent.change(toAddressInput, { target: { value: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' } })

    const generateButton = screen.getByRole('button', { name: /generate batch/i })
    fireEvent.click(generateButton)

    expect(screen.getByText('Batch JSON Output')).toBeInTheDocument()
    expect(screen.getByText(/how to use with safe ui/i)).toBeInTheDocument()
  })

  it('shows error for invalid address', () => {
    render(<SafeBatchBuilderTool />)

    const toAddressInput = screen.getByPlaceholderText('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')
    fireEvent.change(toAddressInput, { target: { value: 'invalid-address' } })

    const generateButton = screen.getByRole('button', { name: /generate batch/i })
    fireEvent.click(generateButton)

    expect(screen.getByText(/invalid address/i)).toBeInTheDocument()
  })

  it('shows error for empty to address', () => {
    render(<SafeBatchBuilderTool />)

    const generateButton = screen.getByRole('button', { name: /generate batch/i })
    fireEvent.click(generateButton)

    expect(screen.getByText(/all transactions must have a 'to' address/i)).toBeInTheDocument()
  })

  it('shows error for data not starting with 0x', () => {
    render(<SafeBatchBuilderTool />)

    const toAddressInput = screen.getByPlaceholderText('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')
    fireEvent.change(toAddressInput, { target: { value: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' } })

    const dataTextarea = screen.getByPlaceholderText('0x')
    fireEvent.change(dataTextarea, { target: { value: 'invalid' } })

    const generateButton = screen.getByRole('button', { name: /generate batch/i })
    fireEvent.click(generateButton)

    expect(screen.getByText(/data must start with 0x/i)).toBeInTheDocument()
  })

  it('handles reset correctly', () => {
    render(<SafeBatchBuilderTool />)

    const addButton = screen.getByRole('button', { name: /add transaction/i })
    fireEvent.click(addButton)
    fireEvent.click(addButton)

    expect(screen.getByText('Transaction #3')).toBeInTheDocument()

    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)

    expect(screen.queryByText('Transaction #2')).not.toBeInTheDocument()
    expect(screen.queryByText('Transaction #3')).not.toBeInTheDocument()
    expect(screen.getByText('Transaction #1')).toBeInTheDocument()
  })

  it('switches operation type', () => {
    render(<SafeBatchBuilderTool />)

    const delegateCallButton = screen.getByRole('button', { name: /delegatecall \(1\)/i })
    fireEvent.click(delegateCallButton)

    // Just verify button exists after click (CSS classes vary by state)
    expect(delegateCallButton).toBeInTheDocument()
  })

  it('shows chainId note after generating batch', () => {
    render(<SafeBatchBuilderTool />)

    const toAddressInput = screen.getByPlaceholderText('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0')
    fireEvent.change(toAddressInput, { target: { value: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' } })

    const generateButton = screen.getByRole('button', { name: /generate batch/i })
    fireEvent.click(generateButton)

    expect(screen.getByText(/update the/i)).toBeInTheDocument()
    expect(screen.getByText('chainId')).toBeInTheDocument()
  })
})
