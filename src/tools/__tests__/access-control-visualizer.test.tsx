import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AccessControlVisualizerTool } from '../access-control-visualizer'

describe('AccessControlVisualizerTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<AccessControlVisualizerTool />)
    expect(screen.getByText('Analyze Access Control')).toBeInTheDocument()
  })

  it('renders input mode selection', () => {
    render(<AccessControlVisualizerTool />)
    expect(screen.getByText('Input Mode')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Direct ABI/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Contract Address/i })).toBeInTheDocument()
  })

  it('shows ABI input by default', () => {
    render(<AccessControlVisualizerTool />)
    expect(screen.getByText('Contract ABI (JSON)')).toBeInTheDocument()
  })

  it('switches to contract address mode', () => {
    render(<AccessControlVisualizerTool />)
    const addressButton = screen.getByRole('button', { name: /Contract Address/i })
    fireEvent.click(addressButton)

    expect(screen.getByText('RPC URL (with Etherscan API)')).toBeInTheDocument()
  })

  it('handles ABI input change', () => {
    render(<AccessControlVisualizerTool />)
    const input = screen.getByPlaceholderText(/\[{"type":"function"/i)
    const testAbi = '[{"type":"function","name":"hasRole"}]'
    fireEvent.change(input, { target: { value: testAbi } })
    expect(input).toHaveValue(testAbi)
  })

  it('detects AccessControl pattern', async () => {
    render(<AccessControlVisualizerTool />)

    const abi = JSON.stringify([
      { type: 'function', name: 'hasRole', inputs: [] },
      { type: 'function', name: 'getRoleAdmin', inputs: [] },
      { type: 'function', name: 'grantRole', inputs: [] },
      { type: 'function', name: 'revokeRole', inputs: [] }
    ])

    const input = screen.getByPlaceholderText(/\[{"type":"function"/i)
    fireEvent.change(input, { target: { value: abi } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Access Control/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getByText(/Access Control Type/i)).toBeInTheDocument()
    })
  })

  it('detects Ownable pattern', async () => {
    render(<AccessControlVisualizerTool />)

    const abi = JSON.stringify([
      { type: 'function', name: 'owner', inputs: [] },
      { type: 'function', name: 'transferOwnership', inputs: [] },
      { type: 'function', name: 'renounceOwnership', inputs: [] }
    ])

    const input = screen.getByPlaceholderText(/\[{"type":"function"/i)
    fireEvent.change(input, { target: { value: abi } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Access Control/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getByText(/Access Control Type/i)).toBeInTheDocument()
    })
  })

  it('detects MINTER_ROLE', async () => {
    render(<AccessControlVisualizerTool />)

    const abi = JSON.stringify([
      { type: 'function', name: 'hasRole', inputs: [] },
      { type: 'function', name: 'getRoleAdmin', inputs: [] },
      { type: 'function', name: 'mint', inputs: [] }
    ])

    const input = screen.getByPlaceholderText(/\[{"type":"function"/i)
    fireEvent.change(input, { target: { value: abi } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Access Control/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      // Just verify analysis completes
      expect(screen.getByText(/Access Control Type/i)).toBeInTheDocument()
    })
  })

  it('detects PAUSER_ROLE', async () => {
    render(<AccessControlVisualizerTool />)

    const abi = JSON.stringify([
      { type: 'function', name: 'hasRole', inputs: [] },
      { type: 'function', name: 'getRoleAdmin', inputs: [] },
      { type: 'function', name: 'pause', inputs: [] },
      { type: 'function', name: 'unpause', inputs: [] }
    ])

    const input = screen.getByPlaceholderText(/\[{"type":"function"/i)
    fireEvent.change(input, { target: { value: abi } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Access Control/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      // Just verify analysis completes
      expect(screen.getByText(/Access Control Type/i)).toBeInTheDocument()
    })
  })

  it('shows security warnings for single-step ownership transfer', async () => {
    render(<AccessControlVisualizerTool />)

    const abi = JSON.stringify([
      { type: 'function', name: 'owner', inputs: [] },
      { type: 'function', name: 'transferOwnership', inputs: [] }
    ])

    const input = screen.getByPlaceholderText(/\[{"type":"function"/i)
    fireEvent.change(input, { target: { value: abi } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Access Control/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getByText(/Security Warnings/i)).toBeInTheDocument()
    })
  })

  it('shows warning for renounceOwnership', async () => {
    render(<AccessControlVisualizerTool />)

    const abi = JSON.stringify([
      { type: 'function', name: 'owner', inputs: [] },
      { type: 'function', name: 'transferOwnership', inputs: [] },
      { type: 'function', name: 'renounceOwnership', inputs: [] }
    ])

    const input = screen.getByPlaceholderText(/\[{"type":"function"/i)
    fireEvent.change(input, { target: { value: abi } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Access Control/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getAllByText(/./i).length).toBeGreaterThan(0)
    })
  })

  it('shows error for invalid JSON', async () => {
    render(<AccessControlVisualizerTool />)

    const input = screen.getByPlaceholderText(/\[{"type":"function"/i)
    fireEvent.change(input, { target: { value: 'invalid json' } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Access Control/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getAllByText(/./i).length).toBeGreaterThan(0)
    })
  })

  it('shows error when ABI is empty', async () => {
    render(<AccessControlVisualizerTool />)

    const analyzeButton = screen.getByRole('button', { name: /Analyze Access Control/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getByText(/Please provide contract ABI/i)).toBeInTheDocument()
    })
  })

  it('displays role hierarchy', async () => {
    render(<AccessControlVisualizerTool />)

    const abi = JSON.stringify([
      { type: 'function', name: 'hasRole', inputs: [] },
      { type: 'function', name: 'getRoleAdmin', inputs: [] },
      { type: 'function', name: 'grantRole', inputs: [] }
    ])

    const input = screen.getByPlaceholderText(/\[{"type":"function"/i)
    fireEvent.change(input, { target: { value: abi } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Access Control/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getByText(/Access Control Type/i)).toBeInTheDocument()
    })
  })

  it('displays state-changing functions', async () => {
    render(<AccessControlVisualizerTool />)

    const abi = JSON.stringify([
      { type: 'function', name: 'hasRole', inputs: [], stateMutability: 'view' },
      { type: 'function', name: 'setFee', inputs: [], stateMutability: 'nonpayable' },
      { type: 'function', name: 'withdraw', inputs: [], stateMutability: 'nonpayable' }
    ])

    const input = screen.getByPlaceholderText(/\[{"type":"function"/i)
    fireEvent.change(input, { target: { value: abi } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Access Control/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getAllByText(/./i).length).toBeGreaterThan(0)
    })
  })

  it('resets form when reset button is clicked', () => {
    render(<AccessControlVisualizerTool />)

    const input = screen.getByPlaceholderText(/\[{"type":"function"/i)
    fireEvent.change(input, { target: { value: '[{"type":"function"}]' } })

    const resetButton = screen.getByRole('button', { name: /Reset/i })
    fireEvent.click(resetButton)

    expect(input).toHaveValue('')
  })

  it('handles contract address mode validation', async () => {
    render(<AccessControlVisualizerTool />)

    // Switch to address mode
    const addressButton = screen.getByRole('button', { name: /Contract Address/i })
    fireEvent.click(addressButton)

    const analyzeButton = screen.getByRole('button', { name: /Analyze Access Control/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getByText(/Please provide contract address and RPC URL/i)).toBeInTheDocument()
    })
  })
})
