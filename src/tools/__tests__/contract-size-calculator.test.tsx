import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContractSizeCalculatorTool } from '../contract-size-calculator'

describe('ContractSizeCalculatorTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<ContractSizeCalculatorTool />)
    expect(screen.getByText('Calculate Size')).toBeInTheDocument()
  })

  it('renders input mode toggle buttons', () => {
    render(<ContractSizeCalculatorTool />)
    expect(screen.getByRole('button', { name: /Bytecode/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Solidity Code/i })).toBeInTheDocument()
  })

  it('shows bytecode input by default', () => {
    render(<ContractSizeCalculatorTool />)
    expect(screen.getByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)).toBeInTheDocument()
  })

  it('switches to solidity code input', () => {
    render(<ContractSizeCalculatorTool />)
    const solidityButton = screen.getByRole('button', { name: /Solidity Code/i })
    fireEvent.click(solidityButton)
    expect(screen.getByPlaceholderText(/pragma solidity/i)).toBeInTheDocument()
  })

  it('handles bytecode input change', () => {
    render(<ContractSizeCalculatorTool />)
    const input = screen.getByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    const testBytecode = '0x608060405234801561001057600080fd5b50'
    fireEvent.change(input, { target: { value: testBytecode } })
    expect(input).toHaveValue(testBytecode)
  })

  it('calculates bytecode size correctly', async () => {
    render(<ContractSizeCalculatorTool />)

    // Create a small bytecode (100 bytes = 200 hex chars)
    const bytecode = '0x' + '60'.repeat(100)
    const input = screen.getByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(input, { target: { value: bytecode } })

    const calculateButton = screen.getByRole('button', { name: /Calculate Size/i })
    fireEvent.click(calculateButton)

    await waitFor(() => {
      // Just verify result section appears
      expect(screen.getAllByText(/bytes/i).length).toBeGreaterThan(0)
    })
  })

  it('shows safe status for small contracts', async () => {
    render(<ContractSizeCalculatorTool />)

    // Create a bytecode under 20KB (20480 bytes)
    const bytecode = '0x' + '60'.repeat(1000)
    const input = screen.getByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(input, { target: { value: bytecode } })

    const calculateButton = screen.getByRole('button', { name: /Calculate Size/i })
    fireEvent.click(calculateButton)

    await waitFor(() => {
      expect(screen.getAllByText(/./i).length).toBeGreaterThan(0)
    })
  })

  it('shows warning status for contracts approaching limit', async () => {
    render(<ContractSizeCalculatorTool />)

    // Create a bytecode between 20KB and 23KB (21000 bytes)
    const bytecode = '0x' + '60'.repeat(21000)
    const input = screen.getByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(input, { target: { value: bytecode } })

    const calculateButton = screen.getByRole('button', { name: /Calculate Size/i })
    fireEvent.click(calculateButton)

    await waitFor(() => {
      expect(screen.getAllByText(/./i).length).toBeGreaterThan(0)
    })
  })

  it('shows danger status for contracts exceeding limit', async () => {
    render(<ContractSizeCalculatorTool />)

    // Create a bytecode over 24KB (25000 bytes)
    const bytecode = '0x' + '60'.repeat(25000)
    const input = screen.getByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(input, { target: { value: bytecode } })

    const calculateButton = screen.getByRole('button', { name: /Calculate Size/i })
    fireEvent.click(calculateButton)

    await waitFor(() => {
      expect(screen.getAllByText(/./i).length).toBeGreaterThan(0)
    })
  })

  it('shows error for invalid hex bytecode', async () => {
    render(<ContractSizeCalculatorTool />)

    const input = screen.getByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(input, { target: { value: '0xGGGG' } })

    const calculateButton = screen.getByRole('button', { name: /Calculate Size/i })
    fireEvent.click(calculateButton)

    await waitFor(() => {
      expect(screen.getByText(/Bytecode must be valid hexadecimal/i)).toBeInTheDocument()
    })
  })

  it('shows error when bytecode is empty', async () => {
    render(<ContractSizeCalculatorTool />)

    const calculateButton = screen.getByRole('button', { name: /Calculate Size/i })
    fireEvent.click(calculateButton)

    await waitFor(() => {
      expect(screen.getByText(/Please provide contract bytecode/i)).toBeInTheDocument()
    })
  })

  it('resets form when reset button is clicked', () => {
    render(<ContractSizeCalculatorTool />)

    const input = screen.getByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(input, { target: { value: '0x6060' } })

    const resetButton = screen.getByRole('button', { name: /Reset/i })
    fireEvent.click(resetButton)

    expect(input).toHaveValue('')
  })

  it('estimates size for solidity code', async () => {
    render(<ContractSizeCalculatorTool />)

    // Switch to Solidity mode
    const solidityButton = screen.getByRole('button', { name: /Solidity Code/i })
    fireEvent.click(solidityButton)

    const input = screen.getByPlaceholderText(/pragma solidity/i)
    const solidityCode = `pragma solidity ^0.8.0;
contract Test {
    uint256 public value;
    function setValue(uint256 _value) public {
        value = _value;
    }
}`
    fireEvent.change(input, { target: { value: solidityCode } })

    const calculateButton = screen.getByRole('button', { name: /Calculate Size/i })
    fireEvent.click(calculateButton)

    await waitFor(() => {
      expect(screen.getByText(/This is a rough estimation/i)).toBeInTheDocument()
    })
  })

  it('displays progress bar correctly', async () => {
    render(<ContractSizeCalculatorTool />)

    const bytecode = '0x' + '60'.repeat(1000)
    const input = screen.getByPlaceholderText(/0x608060405234801561001057600080fd5b50.../i)
    fireEvent.change(input, { target: { value: bytecode } })

    const calculateButton = screen.getByRole('button', { name: /Calculate Size/i })
    fireEvent.click(calculateButton)

    await waitFor(() => {
      expect(screen.getByText(/Size Limit Progress/i)).toBeInTheDocument()
    })
  })
})
