import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Erc20PermitGeneratorTool } from '../erc20-permit-generator'

// Mock viem
vi.mock('viem', () => ({
  keccak256: vi.fn((data: string) => '0x' + 'a'.repeat(64)),
  toHex: vi.fn((data: any) => '0x' + data.toString(16)),
  encodePacked: vi.fn(() => '0x' + 'b'.repeat(64)),
}))

describe('Erc20PermitGeneratorTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<Erc20PermitGeneratorTool />)
    expect(screen.getByText('Generate Permit Structure')).toBeInTheDocument()
  })

  it('renders security warning', () => {
    render(<Erc20PermitGeneratorTool />)
    expect(screen.getByText(/Security Warning:/i)).toBeInTheDocument()
    expect(screen.getByText(/Never share your private key/i)).toBeInTheDocument()
  })

  it('renders all input fields', () => {
    render(<Erc20PermitGeneratorTool />)
    expect(screen.getByText('Owner Address')).toBeInTheDocument()
    expect(screen.getByText('Spender Address')).toBeInTheDocument()
    expect(screen.getByText(/Token Amount/i)).toBeInTheDocument()
    expect(screen.getByText('Token Contract Address')).toBeInTheDocument()
    expect(screen.getByText('Chain ID')).toBeInTheDocument()
    expect(screen.getByText(/Deadline/i)).toBeInTheDocument()
    expect(screen.getByText('Nonce')).toBeInTheDocument()
  })

  it('handles owner address input', () => {
    render(<Erc20PermitGeneratorTool />)
    const input = screen.getByPlaceholderText(/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb/i)
    fireEvent.change(input, { target: { value: '0x1234567890123456789012345678901234567890' } })
    expect(input).toHaveValue('0x1234567890123456789012345678901234567890')
  })

  it('handles spender address input', () => {
    render(<Erc20PermitGeneratorTool />)
    const input = screen.getByPlaceholderText(/0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D/i)
    fireEvent.change(input, { target: { value: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' } })
    expect(input).toHaveValue('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')
  })

  it('handles token amount input', () => {
    render(<Erc20PermitGeneratorTool />)
    const input = screen.getByPlaceholderText('1000000000000000000')
    fireEvent.change(input, { target: { value: '5000000000000000000' } })
    expect(input).toHaveValue('5000000000000000000')
  })

  it('handles token address input', () => {
    render(<Erc20PermitGeneratorTool />)
    const input = screen.getByPlaceholderText(/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/i)
    fireEvent.change(input, { target: { value: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' } })
    expect(input).toHaveValue('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')
  })

  it('handles chain ID input', () => {
    render(<Erc20PermitGeneratorTool />)
    const input = screen.getByPlaceholderText('1')
    fireEvent.change(input, { target: { value: '137' } })
    expect(input).toHaveValue(137)
  })

  it('shows error for missing required fields', async () => {
    render(<Erc20PermitGeneratorTool />)

    const generateButton = screen.getByRole('button', { name: /Generate Permit Structure/i })
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getByText(/Please fill in all required fields/i)).toBeInTheDocument()
    })
  })

  it('validates owner address format', async () => {
    render(<Erc20PermitGeneratorTool />)

    // Fill with invalid owner address
    const ownerInput = screen.getByPlaceholderText(/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb/i)
    fireEvent.change(ownerInput, { target: { value: '0x123' } })

    // Fill other required fields
    const spenderInput = screen.getByPlaceholderText(/0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D/i)
    fireEvent.change(spenderInput, { target: { value: '0x1234567890123456789012345678901234567890' } })

    const amountInput = screen.getByPlaceholderText('1000000000000000000')
    fireEvent.change(amountInput, { target: { value: '1000' } })

    const tokenInput = screen.getByPlaceholderText(/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/i)
    fireEvent.change(tokenInput, { target: { value: '0x1234567890123456789012345678901234567890' } })

    const generateButton = screen.getByRole('button', { name: /Generate Permit Structure/i })
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getByText(/Invalid owner address format/i)).toBeInTheDocument()
    })
  })

  it('generates permit structure with valid inputs', async () => {
    render(<Erc20PermitGeneratorTool />)

    // Fill all required fields
    const ownerInput = screen.getByPlaceholderText(/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb/i)
    fireEvent.change(ownerInput, { target: { value: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' } })

    const spenderInput = screen.getByPlaceholderText(/0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D/i)
    fireEvent.change(spenderInput, { target: { value: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' } })

    const amountInput = screen.getByPlaceholderText('1000000000000000000')
    fireEvent.change(amountInput, { target: { value: '1000000000000000000' } })

    const tokenInput = screen.getByPlaceholderText(/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/i)
    fireEvent.change(tokenInput, { target: { value: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' } })

    const generateButton = screen.getByRole('button', { name: /Generate Permit Structure/i })
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getByText(/EIP-712 Domain/i)).toBeInTheDocument()
      expect(screen.getByText(/EIP-712 Message/i)).toBeInTheDocument()
    })
  })

  it('generates example signature', async () => {
    render(<Erc20PermitGeneratorTool />)

    // Fill all required fields
    const ownerInput = screen.getByPlaceholderText(/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb/i)
    fireEvent.change(ownerInput, { target: { value: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' } })

    const spenderInput = screen.getByPlaceholderText(/0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D/i)
    fireEvent.change(spenderInput, { target: { value: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' } })

    const amountInput = screen.getByPlaceholderText('1000000000000000000')
    fireEvent.change(amountInput, { target: { value: '1000000000000000000' } })

    const tokenInput = screen.getByPlaceholderText(/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/i)
    fireEvent.change(tokenInput, { target: { value: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' } })

    const generateButton = screen.getByRole('button', { name: /Generate Permit Structure/i })
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getByText(/Permit Signature \(Example\)/i)).toBeInTheDocument()
    })
  })

  it('resets form when reset button is clicked', () => {
    render(<Erc20PermitGeneratorTool />)

    const ownerInput = screen.getByPlaceholderText(/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb/i)
    fireEvent.change(ownerInput, { target: { value: '0x1234567890123456789012345678901234567890' } })

    // Find the Reset button (not the last one which is also Reset)
    const resetButtons = screen.getAllByRole('button', { name: /Reset/i })
    fireEvent.click(resetButtons[0])

    expect(ownerInput).toHaveValue('')
  })

  it('displays chain ID hints', () => {
    render(<Erc20PermitGeneratorTool />)
    expect(screen.getByText(/1 = Ethereum/i)).toBeInTheDocument()
    expect(screen.getByText(/137 = Polygon/i)).toBeInTheDocument()
  })

  it('displays nonce hint', () => {
    render(<Erc20PermitGeneratorTool />)
    expect(screen.getByText(/Usually 0 for the first permit/i)).toBeInTheDocument()
  })
})
