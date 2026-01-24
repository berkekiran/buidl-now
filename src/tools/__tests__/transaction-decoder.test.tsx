import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TransactionDecoderTool } from '../transaction-decoder'

describe('TransactionDecoderTool', () => {
  it('renders without crashing', () => {
    render(<TransactionDecoderTool />)
    expect(screen.getByText('Raw Transaction (Hex)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Decode Transaction' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('shows error when input is empty', () => {
    render(<TransactionDecoderTool />)
    fireEvent.click(screen.getByRole('button', { name: 'Decode Transaction' }))
    expect(screen.getByText(/Please enter a transaction hex/)).toBeInTheDocument()
  })

  it('handles input changes', () => {
    render(<TransactionDecoderTool />)
    const textarea = screen.getByPlaceholderText(/0xf86c808504a817c800/)
    fireEvent.change(textarea, { target: { value: '0xtest' } })
    expect(textarea).toHaveValue('0xtest')
  })

  it('shows error for invalid transaction hex', () => {
    render(<TransactionDecoderTool />)
    const textarea = screen.getByPlaceholderText(/0xf86c808504a817c800/)
    fireEvent.change(textarea, { target: { value: '0xinvalid' } })
    fireEvent.click(screen.getByRole('button', { name: 'Decode Transaction' }))
    expect(screen.getByText(/Error:/)).toBeInTheDocument()
  })

  it('resets the form', () => {
    render(<TransactionDecoderTool />)
    const textarea = screen.getByPlaceholderText(/0xf86c808504a817c800/)
    fireEvent.change(textarea, { target: { value: '0xtest' } })
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(textarea).toHaveValue('')
  })

  it('decodes valid EIP-1559 transaction', () => {
    render(<TransactionDecoderTool />)
    const textarea = screen.getByPlaceholderText(/0xf86c808504a817c800/)
    // Valid EIP-1559 transaction hex
    const validTx = '0x02ef0182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0'
    fireEvent.change(textarea, { target: { value: validTx } })
    fireEvent.click(screen.getByRole('button', { name: 'Decode Transaction' }))

    expect(screen.getByText('Decoded Transaction Fields')).toBeInTheDocument()
    expect(screen.getByText('To Address')).toBeInTheDocument()
    expect(screen.getByText('Value (Wei)')).toBeInTheDocument()
    expect(screen.getByText('Value (ETH)')).toBeInTheDocument()
  })

  it('shows info box about real RLP decoding', () => {
    render(<TransactionDecoderTool />)
    expect(screen.getByText(/Real RLP Decoding:/)).toBeInTheDocument()
  })
})
