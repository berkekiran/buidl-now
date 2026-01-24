import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TraceVisualizerTool } from '../trace-visualizer'

describe('TraceVisualizerTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<TraceVisualizerTool />)
    expect(screen.getByText('Input Method')).toBeInTheDocument()
  })

  it('renders input mode selection', () => {
    render(<TraceVisualizerTool />)
    expect(screen.getAllByText(/Trace JSON/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Transaction Hash/i).length).toBeGreaterThan(0)
  })

  it('shows JSON input by default', () => {
    render(<TraceVisualizerTool />)
    expect(screen.getByPlaceholderText(/{"type":"CALL"/i)).toBeInTheDocument()
  })

  it('switches to transaction hash mode', () => {
    render(<TraceVisualizerTool />)
    const txButton = screen.getAllByText(/Transaction Hash/i)[0]
    fireEvent.click(txButton)

    expect(screen.getByPlaceholderText(/0x\.\.\./i)).toBeInTheDocument()
  })

  it('handles trace JSON input change', () => {
    render(<TraceVisualizerTool />)
    const input = screen.getByPlaceholderText(/{"type":"CALL"/i)
    const testJson = '{"type":"CALL"}'
    fireEvent.change(input, { target: { value: testJson } })
    expect(input).toHaveValue(testJson)
  })

  it('parses and visualizes simple trace', async () => {
    render(<TraceVisualizerTool />)

    const traceJson = JSON.stringify({
      type: 'CALL',
      from: '0x1234567890123456789012345678901234567890',
      to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      value: '0x0',
      gas: '0x5208',
      gasUsed: '0x5208',
      input: '0x',
      output: '0x'
    })

    const input = screen.getByPlaceholderText(/{"type":"CALL"/i)
    fireEvent.change(input, { target: { value: traceJson } })

    const parseButton = screen.getByRole('button', { name: /Parse & Visualize/i })
    fireEvent.click(parseButton)

    await waitFor(() => {
      // Check that something was rendered (multiple CALL elements may exist)
      expect(screen.getAllByText(/CALL/i).length).toBeGreaterThan(0)
    })
  })

  it('parses nested trace with calls', async () => {
    render(<TraceVisualizerTool />)

    const traceJson = JSON.stringify({
      type: 'CALL',
      from: '0x1234567890123456789012345678901234567890',
      to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      value: '0x0',
      gas: '0x10000',
      gasUsed: '0x8000',
      input: '0xa9059cbb',
      output: '0x',
      calls: [
        {
          type: 'DELEGATECALL',
          from: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          to: '0x9876543210987654321098765432109876543210',
          value: '0x0',
          gas: '0x5000',
          gasUsed: '0x3000',
          input: '0x',
          output: '0x'
        }
      ]
    })

    const input = screen.getByPlaceholderText(/{"type":"CALL"/i)
    fireEvent.change(input, { target: { value: traceJson } })

    const parseButton = screen.getByRole('button', { name: /Parse & Visualize/i })
    fireEvent.click(parseButton)

    await waitFor(() => {
      expect(screen.getByText(/Total Calls/i)).toBeInTheDocument()
      expect(screen.getByText(/Max Depth/i)).toBeInTheDocument()
    })
  })

  it('shows error for invalid JSON', async () => {
    render(<TraceVisualizerTool />)

    const input = screen.getByPlaceholderText(/{"type":"CALL"/i)
    fireEvent.change(input, { target: { value: 'invalid json' } })

    const parseButton = screen.getByRole('button', { name: /Parse & Visualize/i })
    fireEvent.click(parseButton)

    await waitFor(() => {
      // Check for any error message about JSON parsing
      expect(screen.getByText(/Error:/i)).toBeInTheDocument()
    })
  })

  it('shows error for empty input', async () => {
    render(<TraceVisualizerTool />)

    const parseButton = screen.getByRole('button', { name: /Parse & Visualize/i })
    fireEvent.click(parseButton)

    await waitFor(() => {
      expect(screen.getByText(/Please enter trace JSON/i)).toBeInTheDocument()
    })
  })

  it('resets form when reset button is clicked', () => {
    render(<TraceVisualizerTool />)

    const input = screen.getByPlaceholderText(/{"type":"CALL"/i)
    fireEvent.change(input, { target: { value: '{"type":"CALL"}' } })

    const resetButton = screen.getByRole('button', { name: /Reset/i })
    fireEvent.click(resetButton)

    expect(input).toHaveValue('')
  })

  it('displays statistics after parsing', async () => {
    render(<TraceVisualizerTool />)

    const traceJson = JSON.stringify({
      type: 'CALL',
      from: '0x1234567890123456789012345678901234567890',
      to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      value: '0x0',
      gas: '0x5208',
      gasUsed: '0x5208',
      input: '0x',
      output: '0x'
    })

    const input = screen.getByPlaceholderText(/{"type":"CALL"/i)
    fireEvent.change(input, { target: { value: traceJson } })

    const parseButton = screen.getByRole('button', { name: /Parse & Visualize/i })
    fireEvent.click(parseButton)

    await waitFor(() => {
      expect(screen.getByText(/Total Calls/i)).toBeInTheDocument()
      expect(screen.getByText(/Max Depth/i)).toBeInTheDocument()
      expect(screen.getByText(/Total Gas/i)).toBeInTheDocument()
    })
  })

  it('displays call type legend', async () => {
    render(<TraceVisualizerTool />)

    const traceJson = JSON.stringify({
      type: 'CALL',
      from: '0x1234567890123456789012345678901234567890',
      to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      value: '0x0',
      gas: '0x5208',
      gasUsed: '0x5208',
      input: '0x',
      output: '0x'
    })

    const input = screen.getByPlaceholderText(/{"type":"CALL"/i)
    fireEvent.change(input, { target: { value: traceJson } })

    const parseButton = screen.getByRole('button', { name: /Parse & Visualize/i })
    fireEvent.click(parseButton)

    await waitFor(() => {
      expect(screen.getByText(/Call Type Legend/i)).toBeInTheDocument()
      expect(screen.getByText(/DELEGATECALL/i)).toBeInTheDocument()
      expect(screen.getByText(/STATICCALL/i)).toBeInTheDocument()
    })
  })

  it('shows info box about transaction traces', () => {
    render(<TraceVisualizerTool />)
    expect(screen.getByText(/Transaction Traces:/i)).toBeInTheDocument()
    expect(screen.getAllByText(/debug_traceTransaction/i).length).toBeGreaterThan(0)
  })

  it('handles transaction hash mode validation', async () => {
    render(<TraceVisualizerTool />)

    // Switch to tx mode
    const txButton = screen.getAllByText(/Transaction Hash/i)[0]
    fireEvent.click(txButton)

    // Try to fetch without inputs
    const fetchButton = screen.getByRole('button', { name: /Fetch & Visualize/i })
    fireEvent.click(fetchButton)

    await waitFor(() => {
      expect(screen.getByText(/Please enter transaction hash/i)).toBeInTheDocument()
    })
  })

  it('shows RPC warning in transaction mode', () => {
    render(<TraceVisualizerTool />)

    // Switch to tx mode
    const txButton = screen.getAllByText(/Transaction Hash/i)[0]
    fireEvent.click(txButton)

    expect(screen.getByText(/debug_traceTransaction requires archive node access/i)).toBeInTheDocument()
  })
})
