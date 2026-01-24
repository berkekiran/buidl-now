import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BytecodeDifferTool } from '../bytecode-differ'

describe('BytecodeDifferTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<BytecodeDifferTool />)
    expect(screen.getByText('Compare Bytecode')).toBeInTheDocument()
  })

  it('renders input mode selection', () => {
    render(<BytecodeDifferTool />)
    expect(screen.getByText('Input Mode')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Direct Bytecode/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Fetch from RPC/i })).toBeInTheDocument()
  })

  it('shows direct bytecode input by default', () => {
    render(<BytecodeDifferTool />)
    expect(screen.getByText('Bytecode 1 (hex)')).toBeInTheDocument()
    expect(screen.getByText('Bytecode 2 (hex)')).toBeInTheDocument()
  })

  it('switches to fetch from RPC mode', () => {
    render(<BytecodeDifferTool />)
    const fetchButton = screen.getByRole('button', { name: /Fetch from RPC/i })
    fireEvent.click(fetchButton)

    expect(screen.getByText('RPC URL')).toBeInTheDocument()
    expect(screen.getByText('Contract Address 1')).toBeInTheDocument()
    expect(screen.getByText('Contract Address 2')).toBeInTheDocument()
  })

  it('handles bytecode 1 input', () => {
    render(<BytecodeDifferTool />)
    const inputs = screen.getAllByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(inputs[0], { target: { value: '0x6060' } })
    expect(inputs[0]).toHaveValue('0x6060')
  })

  it('handles bytecode 2 input', () => {
    render(<BytecodeDifferTool />)
    const inputs = screen.getAllByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(inputs[1], { target: { value: '0x6060' } })
    expect(inputs[1]).toHaveValue('0x6060')
  })

  it('compares identical bytecodes', async () => {
    render(<BytecodeDifferTool />)

    const bytecode = '0x608060405234801561001057600080fd5b50'
    const inputs = screen.getAllByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(inputs[0], { target: { value: bytecode } })
    fireEvent.change(inputs[1], { target: { value: bytecode } })

    const compareButton = screen.getByRole('button', { name: /Compare Bytecode/i })
    fireEvent.click(compareButton)

    await waitFor(() => {
      expect(screen.getByText(/Similarity Score/i)).toBeInTheDocument()
      expect(screen.getByText('100%')).toBeInTheDocument()
      expect(screen.getByText(/Bytecodes are identical/i)).toBeInTheDocument()
    })
  })

  it('compares different bytecodes', async () => {
    render(<BytecodeDifferTool />)

    const bytecode1 = '0x608060405234801561001057600080fd5b50'
    const bytecode2 = '0x608060405234801561001057600080fd5b51'
    const inputs = screen.getAllByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(inputs[0], { target: { value: bytecode1 } })
    fireEvent.change(inputs[1], { target: { value: bytecode2 } })

    const compareButton = screen.getByRole('button', { name: /Compare Bytecode/i })
    fireEvent.click(compareButton)

    await waitFor(() => {
      expect(screen.getByText(/Similarity Score/i)).toBeInTheDocument()
      expect(screen.getByText(/difference\(s\) detected/i)).toBeInTheDocument()
    })
  })

  it('shows error when bytecode 1 is missing', async () => {
    render(<BytecodeDifferTool />)

    const inputs = screen.getAllByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(inputs[1], { target: { value: '0x6060' } })

    const compareButton = screen.getByRole('button', { name: /Compare Bytecode/i })
    fireEvent.click(compareButton)

    await waitFor(() => {
      expect(screen.getByText(/Please provide both bytecodes/i)).toBeInTheDocument()
    })
  })

  it('shows error when bytecode 2 is missing', async () => {
    render(<BytecodeDifferTool />)

    const inputs = screen.getAllByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(inputs[0], { target: { value: '0x6060' } })

    const compareButton = screen.getByRole('button', { name: /Compare Bytecode/i })
    fireEvent.click(compareButton)

    await waitFor(() => {
      expect(screen.getByText(/Please provide both bytecodes/i)).toBeInTheDocument()
    })
  })

  it('displays diff view legend', async () => {
    render(<BytecodeDifferTool />)

    const bytecode = '0x608060405234801561001057600080fd5b50'
    const inputs = screen.getAllByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(inputs[0], { target: { value: bytecode } })
    fireEvent.change(inputs[1], { target: { value: bytecode } })

    const compareButton = screen.getByRole('button', { name: /Compare Bytecode/i })
    fireEvent.click(compareButton)

    await waitFor(() => {
      expect(screen.getByText(/Diff View/i)).toBeInTheDocument()
      expect(screen.getByText(/Match/i)).toBeInTheDocument()
      expect(screen.getByText(/Differ/i)).toBeInTheDocument()
      expect(screen.getByText(/Metadata/i)).toBeInTheDocument()
    })
  })

  it('handles bytecode with 0x prefix', async () => {
    render(<BytecodeDifferTool />)

    const bytecode1 = '0x6060'
    const bytecode2 = '0x6060'
    const inputs = screen.getAllByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(inputs[0], { target: { value: bytecode1 } })
    fireEvent.change(inputs[1], { target: { value: bytecode2 } })

    const compareButton = screen.getByRole('button', { name: /Compare Bytecode/i })
    fireEvent.click(compareButton)

    await waitFor(() => {
      expect(screen.getByText('100%')).toBeInTheDocument()
    })
  })

  it('handles bytecode without 0x prefix', async () => {
    render(<BytecodeDifferTool />)

    const bytecode1 = '6060'
    const bytecode2 = '6060'
    const inputs = screen.getAllByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(inputs[0], { target: { value: bytecode1 } })
    fireEvent.change(inputs[1], { target: { value: bytecode2 } })

    const compareButton = screen.getByRole('button', { name: /Compare Bytecode/i })
    fireEvent.click(compareButton)

    await waitFor(() => {
      expect(screen.getByText('100%')).toBeInTheDocument()
    })
  })

  it('resets form when reset button is clicked', () => {
    render(<BytecodeDifferTool />)

    const inputs = screen.getAllByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(inputs[0], { target: { value: '0x6060' } })
    fireEvent.change(inputs[1], { target: { value: '0x6061' } })

    const resetButton = screen.getByRole('button', { name: /Reset/i })
    fireEvent.click(resetButton)

    expect(inputs[0]).toHaveValue('')
    expect(inputs[1]).toHaveValue('')
  })

  it('extracts and displays metadata', async () => {
    render(<BytecodeDifferTool />)

    // Bytecode with simulated metadata (a264...0033 pattern)
    const bytecodeWithMetadata = '0x6080604052a26469706673582212200033'
    const inputs = screen.getAllByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(inputs[0], { target: { value: bytecodeWithMetadata } })
    fireEvent.change(inputs[1], { target: { value: bytecodeWithMetadata } })

    const compareButton = screen.getByRole('button', { name: /Compare Bytecode/i })
    fireEvent.click(compareButton)

    await waitFor(() => {
      expect(screen.getByText(/Similarity Score/i)).toBeInTheDocument()
    })
  })

  it('handles fetch mode validation', async () => {
    render(<BytecodeDifferTool />)

    // Switch to fetch mode
    const fetchButton = screen.getByRole('button', { name: /Fetch from RPC/i })
    fireEvent.click(fetchButton)

    const compareButton = screen.getByRole('button', { name: /Compare Bytecode/i })
    fireEvent.click(compareButton)

    await waitFor(() => {
      expect(screen.getByText(/Please provide both addresses and RPC URL/i)).toBeInTheDocument()
    })
  })
})
