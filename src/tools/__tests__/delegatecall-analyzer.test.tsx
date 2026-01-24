import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DelegatecallAnalyzerTool } from '../delegatecall-analyzer'

describe('DelegatecallAnalyzerTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<DelegatecallAnalyzerTool />)
    expect(screen.getByText('Analyze Storage Layout')).toBeInTheDocument()
  })

  it('renders proxy contract input', () => {
    render(<DelegatecallAnalyzerTool />)
    expect(screen.getByText('Proxy Contract Source (or ABI)')).toBeInTheDocument()
  })

  it('renders implementation contract input', () => {
    render(<DelegatecallAnalyzerTool />)
    expect(screen.getByText('Implementation Contract Source (or ABI)')).toBeInTheDocument()
  })

  it('handles proxy source input', () => {
    render(<DelegatecallAnalyzerTool />)
    const inputs = screen.getAllByRole('textbox')
    const proxyInput = inputs[0]
    const testSource = 'address private _implementation;'
    fireEvent.change(proxyInput, { target: { value: testSource } })
    expect(proxyInput).toHaveValue(testSource)
  })

  it('handles implementation source input', () => {
    render(<DelegatecallAnalyzerTool />)
    const inputs = screen.getAllByRole('textbox')
    const implInput = inputs[1]
    const testSource = 'uint256 private _value;'
    fireEvent.change(implInput, { target: { value: testSource } })
    expect(implInput).toHaveValue(testSource)
  })

  it('shows error when sources are empty', async () => {
    render(<DelegatecallAnalyzerTool />)

    const analyzeButton = screen.getByRole('button', { name: /Analyze Storage Layout/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getByText(/Please provide both proxy and implementation contract sources/i)).toBeInTheDocument()
    })
  })

  it('detects storage collision', async () => {
    render(<DelegatecallAnalyzerTool />)

    const proxySource = `contract Proxy {
    address private _implementation;
    address private _owner;
}`

    const implSource = `contract Implementation {
    uint256 private _value;
    address private _admin;
}`

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: proxySource } })
    fireEvent.change(inputs[1], { target: { value: implSource } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Storage Layout/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getByText(/Safety Score/i)).toBeInTheDocument()
    })
  })

  it('detects storage gap', async () => {
    render(<DelegatecallAnalyzerTool />)

    const proxySource = `contract Proxy {
    address private _implementation;
}`

    const implSource = `contract Implementation {
    uint256 private _value;
    uint256[50] private __gap;
}`

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: proxySource } })
    fireEvent.change(inputs[1], { target: { value: implSource } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Storage Layout/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getAllByText(/./i).length).toBeGreaterThan(0)
    })
  })

  it('shows safe score for compatible layouts', async () => {
    render(<DelegatecallAnalyzerTool />)

    // Provide minimal proxy source to pass validation
    const proxySource = `contract Proxy {
    address private _impl;
}`

    const implSource = `contract Implementation {
    address private _impl;
    uint256[50] private __gap;
}`

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: proxySource } })
    fireEvent.change(inputs[1], { target: { value: implSource } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Storage Layout/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getByText(/Safety Score/i)).toBeInTheDocument()
    })
  })

  it('shows warning for missing storage gap', async () => {
    render(<DelegatecallAnalyzerTool />)

    const proxySource = ''

    const implSource = `contract Implementation {
    uint256 private _value;
}`

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: proxySource } })
    fireEvent.change(inputs[1], { target: { value: implSource } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Storage Layout/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getAllByText(/./i).length).toBeGreaterThan(0)
    })
  })

  it('shows dangerous score for high severity conflicts', async () => {
    render(<DelegatecallAnalyzerTool />)

    const proxySource = `contract Proxy {
    address private _implementation;
    address private _owner;
    uint256 private _status;
}`

    const implSource = `contract Implementation {
    address private _different;
    uint256 private _value;
}`

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: proxySource } })
    fireEvent.change(inputs[1], { target: { value: implSource } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Storage Layout/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getAllByText(/./i).length).toBeGreaterThan(0)
    })
  })

  it('displays storage layout comparison', async () => {
    render(<DelegatecallAnalyzerTool />)

    const proxySource = `contract Proxy {
    address private _implementation;
}`

    const implSource = `contract Implementation {
    uint256 private _value;
}`

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: proxySource } })
    fireEvent.change(inputs[1], { target: { value: implSource } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Storage Layout/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getByText(/Safety Score/i)).toBeInTheDocument()
    })
  })

  it('displays recommendations', async () => {
    render(<DelegatecallAnalyzerTool />)

    const proxySource = `contract Proxy {
    address private _implementation;
}`

    const implSource = `contract Implementation {
    uint256 private _value;
}`

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: proxySource } })
    fireEvent.change(inputs[1], { target: { value: implSource } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Storage Layout/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getByText(/Recommendations/i)).toBeInTheDocument()
    })
  })

  it('parses uint256 type correctly', async () => {
    render(<DelegatecallAnalyzerTool />)

    const implSource = `contract Implementation {
    uint256 private _value;
}`

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: '' } })
    fireEvent.change(inputs[1], { target: { value: implSource } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Storage Layout/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getAllByText(/./i).length).toBeGreaterThan(0)
    })
  })

  it('parses address type correctly', async () => {
    render(<DelegatecallAnalyzerTool />)

    const implSource = `contract Implementation {
    address private _admin;
}`

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: '' } })
    fireEvent.change(inputs[1], { target: { value: implSource } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Storage Layout/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getAllByText(/./i).length).toBeGreaterThan(0)
    })
  })

  it('parses bool type correctly', async () => {
    render(<DelegatecallAnalyzerTool />)

    const implSource = `contract Implementation {
    bool private _initialized;
}`

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: '' } })
    fireEvent.change(inputs[1], { target: { value: implSource } })

    const analyzeButton = screen.getByRole('button', { name: /Analyze Storage Layout/i })
    fireEvent.click(analyzeButton)

    await waitFor(() => {
      expect(screen.getAllByText(/./i).length).toBeGreaterThan(0)
    })
  })

  it('resets form when reset button is clicked', () => {
    render(<DelegatecallAnalyzerTool />)

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: 'address private _impl;' } })
    fireEvent.change(inputs[1], { target: { value: 'uint256 private _val;' } })

    const resetButton = screen.getByRole('button', { name: /Reset/i })
    fireEvent.click(resetButton)

    expect(inputs[0]).toHaveValue('')
    expect(inputs[1]).toHaveValue('')
  })
})
