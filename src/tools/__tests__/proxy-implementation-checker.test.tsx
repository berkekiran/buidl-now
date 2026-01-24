import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProxyImplementationCheckerTool } from '../proxy-implementation-checker'

// Mock viem
vi.mock('viem', async () => {
  const actual = await vi.importActual('viem')
  return {
    ...actual,
    createPublicClient: vi.fn(() => ({
      getStorageAt: vi.fn().mockResolvedValue('0x0000000000000000000000000000000000000000000000000000000000000000'),
      readContract: vi.fn().mockRejectedValue(new Error('Not a proxy')),
    })),
  }
})

describe('ProxyImplementationCheckerTool', () => {
  it('renders without crashing', () => {
    render(<ProxyImplementationCheckerTool />)
    expect(screen.getByText('Proxy Contract Address')).toBeInTheDocument()
    expect(screen.getByText('RPC URL')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /check proxy/i })).toBeInTheDocument()
  })

  it('has default RPC URL', () => {
    render(<ProxyImplementationCheckerTool />)
    const rpcInput = screen.getByPlaceholderText('https://eth.llamarpc.com')
    expect(rpcInput).toHaveValue('https://eth.llamarpc.com')
  })

  it('shows error for empty inputs', async () => {
    render(<ProxyImplementationCheckerTool />)

    const checkButton = screen.getByRole('button', { name: /check proxy/i })
    fireEvent.click(checkButton)

    await waitFor(() => {
      expect(screen.getByText(/please provide both proxy address and rpc url/i)).toBeInTheDocument()
    })
  })

  it('shows error for invalid address format', async () => {
    render(<ProxyImplementationCheckerTool />)

    const addressInput = screen.getByPlaceholderText('0x1234567890abcdef1234567890abcdef12345678')
    fireEvent.change(addressInput, { target: { value: 'invalid-address' } })

    const checkButton = screen.getByRole('button', { name: /check proxy/i })
    fireEvent.click(checkButton)

    await waitFor(() => {
      // Should show some error (either viem validation or custom error)
      const errorElement = document.querySelector('.text-\\[var\\(--color-red-500\\)\\]')
      expect(errorElement).toBeInTheDocument()
    })
  })

  it('handles reset correctly', async () => {
    render(<ProxyImplementationCheckerTool />)

    const addressInput = screen.getByPlaceholderText('0x1234567890abcdef1234567890abcdef12345678')
    fireEvent.change(addressInput, { target: { value: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2' } })

    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)

    expect(addressInput).toHaveValue('')
  })

  it('shows loading state when checking', async () => {
    render(<ProxyImplementationCheckerTool />)

    const addressInput = screen.getByPlaceholderText('0x1234567890abcdef1234567890abcdef12345678')
    fireEvent.change(addressInput, { target: { value: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2' } })

    const checkButton = screen.getByRole('button', { name: /check proxy/i })
    fireEvent.click(checkButton)

    // Button should show loading state
    expect(screen.getByText(/checking/i)).toBeInTheDocument()
  })

  it('does not show results initially', () => {
    render(<ProxyImplementationCheckerTool />)
    expect(screen.queryByText('Proxy Type Detected')).not.toBeInTheDocument()
    expect(screen.queryByText('Implementation Address')).not.toBeInTheDocument()
  })

  it('has inputs for address and RPC URL', () => {
    render(<ProxyImplementationCheckerTool />)

    const addressInput = screen.getByPlaceholderText('0x1234567890abcdef1234567890abcdef12345678')
    const rpcInput = screen.getByPlaceholderText('https://eth.llamarpc.com')

    expect(addressInput).toBeInTheDocument()
    expect(rpcInput).toBeInTheDocument()

    // Test that inputs accept values
    fireEvent.change(addressInput, { target: { value: '0xtest' } })
    fireEvent.change(rpcInput, { target: { value: 'https://custom-rpc.com' } })

    expect(addressInput).toHaveValue('0xtest')
    expect(rpcInput).toHaveValue('https://custom-rpc.com')
  })

  it('disables check button while loading', async () => {
    render(<ProxyImplementationCheckerTool />)

    const addressInput = screen.getByPlaceholderText('0x1234567890abcdef1234567890abcdef12345678')
    fireEvent.change(addressInput, { target: { value: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2' } })

    const checkButton = screen.getByRole('button', { name: /check proxy/i })
    fireEvent.click(checkButton)

    // Button should be disabled while loading
    expect(checkButton).toBeDisabled()
  })
})
