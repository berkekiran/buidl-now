import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TimelockTransactionBuilderTool } from '../timelock-transaction-builder'

describe('TimelockTransactionBuilderTool', () => {
  it('renders without crashing', () => {
    render(<TimelockTransactionBuilderTool />)
    expect(screen.getByText('Target Contract Address')).toBeInTheDocument()
    expect(screen.getByText('Function Signature')).toBeInTheDocument()
    expect(screen.getByText('Parameters (comma-separated)')).toBeInTheDocument()
    expect(screen.getByText('Value (ETH)')).toBeInTheDocument()
    expect(screen.getByText('Delay (Days)')).toBeInTheDocument()
    expect(screen.getByText('Delay (Hours)')).toBeInTheDocument()
  })

  it('has generate button', () => {
    render(<TimelockTransactionBuilderTool />)
    expect(screen.getByRole('button', { name: /generate timelock data/i })).toBeInTheDocument()
  })

  it('generates timelock data with valid inputs', () => {
    render(<TimelockTransactionBuilderTool />)

    // Use getAllByRole since multiple inputs have similar placeholders
    const inputs = screen.getAllByRole('textbox')
    const targetInput = inputs[0] // Target Contract Address
    const signatureInput = inputs[1] // Function Signature
    const paramsInput = inputs[2] // Parameters
    const valueInput = inputs[3] // Value
    const daysInput = screen.getByPlaceholderText('2')
    const hoursInput = screen.getByPlaceholderText('12')

    fireEvent.change(targetInput, { target: { value: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' } })
    fireEvent.change(signatureInput, { target: { value: 'transfer(address,uint256)' } })
    fireEvent.change(daysInput, { target: { value: '2' } })
    fireEvent.change(hoursInput, { target: { value: '0' } })

    const generateButton = screen.getByRole('button', { name: /generate timelock data/i })
    fireEvent.click(generateButton)

    expect(screen.getByText('Function Calldata')).toBeInTheDocument()
    expect(screen.getByText('ETA Timestamp (Unix)')).toBeInTheDocument()
    expect(screen.getByText('Execution Time (Human Readable)')).toBeInTheDocument()
    expect(screen.getByText('Queue Transaction Data')).toBeInTheDocument()
    expect(screen.getByText('Execute Transaction Data')).toBeInTheDocument()
  })

  it('shows timelock workflow instructions', () => {
    render(<TimelockTransactionBuilderTool />)

    const inputs = screen.getAllByRole('textbox')
    const targetInput = inputs[0]
    const signatureInput = inputs[1]
    const daysInput = screen.getByPlaceholderText('2')

    fireEvent.change(targetInput, { target: { value: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' } })
    fireEvent.change(signatureInput, { target: { value: 'transfer(address,uint256)' } })
    fireEvent.change(daysInput, { target: { value: '2' } })

    const generateButton = screen.getByRole('button', { name: /generate timelock data/i })
    fireEvent.click(generateButton)

    expect(screen.getByText('Timelock Workflow')).toBeInTheDocument()
    expect(screen.getAllByText(/call queueTransaction/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/wait for the delay period/i)).toBeInTheDocument()
  })

  it('handles reset correctly', () => {
    render(<TimelockTransactionBuilderTool />)

    const inputs = screen.getAllByRole('textbox')
    const targetInput = inputs[0]
    const signatureInput = inputs[1]
    const daysInput = screen.getByPlaceholderText('2')

    fireEvent.change(targetInput, { target: { value: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' } })
    fireEvent.change(signatureInput, { target: { value: 'transfer(address,uint256)' } })
    fireEvent.change(daysInput, { target: { value: '2' } })

    const generateButton = screen.getByRole('button', { name: /generate timelock data/i })
    fireEvent.click(generateButton)

    const resetButton = screen.getByRole('button', { name: /reset builder/i })
    fireEvent.click(resetButton)

    expect(targetInput).toHaveValue('')
    expect(signatureInput).toHaveValue('')
    expect(screen.queryByText('Function Calldata')).not.toBeInTheDocument()
  })

  it('does not generate with invalid address', () => {
    render(<TimelockTransactionBuilderTool />)

    const inputs = screen.getAllByRole('textbox')
    const targetInput = inputs[0]
    const signatureInput = inputs[1]
    const daysInput = screen.getByPlaceholderText('2')

    fireEvent.change(targetInput, { target: { value: 'invalid-address' } })
    fireEvent.change(signatureInput, { target: { value: 'transfer(address,uint256)' } })
    fireEvent.change(daysInput, { target: { value: '2' } })

    const generateButton = screen.getByRole('button', { name: /generate timelock data/i })
    fireEvent.click(generateButton)

    expect(screen.queryByText('Function Calldata')).not.toBeInTheDocument()
  })

  it('does not generate with zero delay', () => {
    render(<TimelockTransactionBuilderTool />)

    const inputs = screen.getAllByRole('textbox')
    const targetInput = inputs[0]
    const signatureInput = inputs[1]

    fireEvent.change(targetInput, { target: { value: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' } })
    fireEvent.change(signatureInput, { target: { value: 'transfer(address,uint256)' } })
    // No delay specified

    const generateButton = screen.getByRole('button', { name: /generate timelock data/i })
    fireEvent.click(generateButton)

    expect(screen.queryByText('Function Calldata')).not.toBeInTheDocument()
  })
})
