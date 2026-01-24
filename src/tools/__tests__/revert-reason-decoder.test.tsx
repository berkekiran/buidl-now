import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RevertReasonDecoderTool } from '../revert-reason-decoder'

describe('RevertReasonDecoderTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<RevertReasonDecoderTool />)
    expect(screen.getByText('Input Method')).toBeInTheDocument()
  })

  it('renders input mode selection', () => {
    render(<RevertReasonDecoderTool />)
    expect(screen.getAllByText(/Revert Data \(Hex\)/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Transaction Hash/i).length).toBeGreaterThan(0)
  })

  it('shows hex input by default', () => {
    render(<RevertReasonDecoderTool />)
    expect(screen.getByPlaceholderText(/0x08c379a0/i)).toBeInTheDocument()
  })

  it('switches to transaction hash mode', () => {
    render(<RevertReasonDecoderTool />)
    const txButton = screen.getByText(/Transaction Hash/i)
    fireEvent.click(txButton)

    expect(screen.getByPlaceholderText(/0x\.\.\./i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/https:\/\/eth-mainnet/i)).toBeInTheDocument()
  })

  it('handles revert data input change', () => {
    render(<RevertReasonDecoderTool />)
    const input = screen.getByPlaceholderText(/0x08c379a0/i)
    const testData = '0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000'
    fireEvent.change(input, { target: { value: testData } })
    expect(input).toHaveValue(testData)
  })

  it('decodes standard Error(string) revert', async () => {
    render(<RevertReasonDecoderTool />)

    // Standard Error(string) selector: 0x08c379a0
    const errorData = '0x08c379a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000012496e73756666696369656e742066756e64730000000000000000000000000000'
    const input = screen.getByPlaceholderText(/0x08c379a0/i)
    fireEvent.change(input, { target: { value: errorData } })

    const decodeButton = screen.getByRole('button', { name: /Decode Revert Data/i })
    fireEvent.click(decodeButton)

    await waitFor(() => {
      // Multiple elements may match, use getAllByText
      expect(screen.getAllByText(/Error Selector/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/0x08c379a0/i).length).toBeGreaterThan(0)
    })
  })

  it('decodes Panic error', async () => {
    render(<RevertReasonDecoderTool />)

    // Panic(uint256) selector: 0x4e487b71
    const panicData = '0x4e487b710000000000000000000000000000000000000000000000000000000000000011'
    const input = screen.getByPlaceholderText(/0x08c379a0/i)
    fireEvent.change(input, { target: { value: panicData } })

    const decodeButton = screen.getByRole('button', { name: /Decode Revert Data/i })
    fireEvent.click(decodeButton)

    await waitFor(() => {
      expect(screen.getByText(/Panic Error Detected/i)).toBeInTheDocument()
      expect(screen.getAllByText(/0x11/i).length).toBeGreaterThan(0)
    })
  })

  it('shows custom error for unknown selector', async () => {
    render(<RevertReasonDecoderTool />)

    const customErrorData = '0x12345678000000000000000000000000000000000000000000000000000000000000'
    const input = screen.getByPlaceholderText(/0x08c379a0/i)
    fireEvent.change(input, { target: { value: customErrorData } })

    const decodeButton = screen.getByRole('button', { name: /Decode Revert Data/i })
    fireEvent.click(decodeButton)

    await waitFor(() => {
      expect(screen.getAllByText(/Custom Error/i).length).toBeGreaterThan(0)
    })
  })

  it('shows error for empty input', async () => {
    render(<RevertReasonDecoderTool />)

    const decodeButton = screen.getByRole('button', { name: /Decode Revert Data/i })
    fireEvent.click(decodeButton)

    await waitFor(() => {
      expect(screen.getByText(/Please enter revert data/i)).toBeInTheDocument()
    })
  })

  it('shows error for invalid data format', async () => {
    render(<RevertReasonDecoderTool />)

    const input = screen.getByPlaceholderText(/0x08c379a0/i)
    fireEvent.change(input, { target: { value: '0x123' } })

    const decodeButton = screen.getByRole('button', { name: /Decode Revert Data/i })
    fireEvent.click(decodeButton)

    await waitFor(() => {
      expect(screen.getByText(/Invalid revert data format/i)).toBeInTheDocument()
    })
  })

  it('resets form when reset button is clicked', () => {
    render(<RevertReasonDecoderTool />)

    const input = screen.getByPlaceholderText(/0x08c379a0/i)
    fireEvent.change(input, { target: { value: '0x08c379a0' } })

    const resetButton = screen.getByRole('button', { name: /Reset/i })
    fireEvent.click(resetButton)

    expect(input).toHaveValue('')
  })

  it('displays common error selectors reference', () => {
    render(<RevertReasonDecoderTool />)
    expect(screen.getByText(/Common Error Selectors/i)).toBeInTheDocument()
    expect(screen.getAllByText(/0x08c379a0/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/0x4e487b71/i).length).toBeGreaterThan(0)
  })

  it('displays panic codes reference', () => {
    render(<RevertReasonDecoderTool />)
    expect(screen.getByText(/Panic Codes Reference/i)).toBeInTheDocument()
    expect(screen.getByText(/Assert failed/i)).toBeInTheDocument()
    expect(screen.getByText(/Arithmetic overflow/i)).toBeInTheDocument()
  })

  it('shows info box about error types', () => {
    render(<RevertReasonDecoderTool />)
    expect(screen.getAllByText(/Error Types:/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/require\(\)/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/revert CustomError\(\)/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Panic/i).length).toBeGreaterThan(0)
  })

  it('handles transaction hash mode validation', async () => {
    render(<RevertReasonDecoderTool />)

    // Switch to tx mode
    const txButton = screen.getByText(/Transaction Hash/i)
    fireEvent.click(txButton)

    // Try to fetch without inputs
    const fetchButton = screen.getByRole('button', { name: /Fetch & Decode/i })
    fireEvent.click(fetchButton)

    await waitFor(() => {
      expect(screen.getByText(/Please enter transaction hash/i)).toBeInTheDocument()
    })
  })

  it('validates RPC URL in transaction mode', async () => {
    render(<RevertReasonDecoderTool />)

    // Switch to tx mode
    const txButton = screen.getByText(/Transaction Hash/i)
    fireEvent.click(txButton)

    // Enter tx hash but no RPC URL
    const txInput = screen.getByPlaceholderText(/0x\.\.\./i)
    fireEvent.change(txInput, { target: { value: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' } })

    const fetchButton = screen.getByRole('button', { name: /Fetch & Decode/i })
    fireEvent.click(fetchButton)

    await waitFor(() => {
      expect(screen.getByText(/Please enter RPC URL/i)).toBeInTheDocument()
    })
  })
})
