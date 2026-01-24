import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PrivateKeyToAddressTool } from '../private-key-to-address'

// Mock crypto.getRandomValues
beforeEach(() => {
  vi.spyOn(crypto, 'getRandomValues').mockImplementation((arr) => {
    const typedArr = arr as Uint8Array
    for (let i = 0; i < typedArr.length; i++) {
      typedArr[i] = i % 256
    }
    return arr
  })
})

describe('PrivateKeyToAddressTool', () => {
  it('renders without crashing', () => {
    render(<PrivateKeyToAddressTool />)
    expect(screen.getByText('Private Key (hex)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Convert to Address' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Generate Random' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('shows security warning', () => {
    render(<PrivateKeyToAddressTool />)
    expect(screen.getByText('Security Warning')).toBeInTheDocument()
    expect(screen.getByText(/Never share your private key with anyone/)).toBeInTheDocument()
  })

  it('shows error when input is empty', () => {
    render(<PrivateKeyToAddressTool />)
    fireEvent.click(screen.getByRole('button', { name: 'Convert to Address' }))
    expect(screen.getByText(/Please enter a private key/)).toBeInTheDocument()
  })

  it('shows error for invalid private key format', () => {
    render(<PrivateKeyToAddressTool />)
    const input = screen.getByPlaceholderText('0x1234567890abcdef...')
    fireEvent.change(input, { target: { value: 'invalid' } })
    fireEvent.click(screen.getByRole('button', { name: 'Convert to Address' }))
    expect(screen.getByText(/Invalid private key format/)).toBeInTheDocument()
  })

  it('converts valid private key to address', () => {
    render(<PrivateKeyToAddressTool />)
    const input = screen.getByPlaceholderText('0x1234567890abcdef...')
    const validKey = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    fireEvent.change(input, { target: { value: validKey } })
    fireEvent.click(screen.getByRole('button', { name: 'Convert to Address' }))

    expect(screen.getByText('Public Address')).toBeInTheDocument()
    expect(screen.getByText(/Success!/)).toBeInTheDocument()
  })

  it('handles private key without 0x prefix', () => {
    render(<PrivateKeyToAddressTool />)
    const input = screen.getByPlaceholderText('0x1234567890abcdef...')
    const keyWithoutPrefix = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    fireEvent.change(input, { target: { value: keyWithoutPrefix } })
    fireEvent.click(screen.getByRole('button', { name: 'Convert to Address' }))

    expect(screen.getByText('Public Address')).toBeInTheDocument()
  })

  it('generates random private key', () => {
    render(<PrivateKeyToAddressTool />)
    fireEvent.click(screen.getByRole('button', { name: 'Generate Random' }))
    const input = screen.getByPlaceholderText('0x1234567890abcdef...')
    expect((input as HTMLInputElement).value).toMatch(/^0x[0-9a-f]{64}$/i)
  })

  it('resets the form', () => {
    render(<PrivateKeyToAddressTool />)
    const input = screen.getByPlaceholderText('0x1234567890abcdef...')
    fireEvent.change(input, { target: { value: '0xtest' } })
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(input).toHaveValue('')
  })

  it('shows info box about how it works', () => {
    render(<PrivateKeyToAddressTool />)
    expect(screen.getByText(/How it works:/)).toBeInTheDocument()
  })
})
