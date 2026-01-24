import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TokenLaunchCalculatorTool } from '../token-launch-calculator'

describe('TokenLaunchCalculatorTool', () => {
  it('renders without crashing', () => {
    render(<TokenLaunchCalculatorTool />)
    expect(screen.getByText('Total Token Supply')).toBeInTheDocument()
    expect(screen.getByText('Liquidity Pool Allocation (%)')).toBeInTheDocument()
    expect(screen.getByText('ETH Amount for Liquidity')).toBeInTheDocument()
    expect(screen.getByText('Desired Initial Price (ETH per Token)')).toBeInTheDocument()
  })

  it('has a calculate button', () => {
    render(<TokenLaunchCalculatorTool />)
    expect(screen.getByRole('button', { name: /calculate launch metrics/i })).toBeInTheDocument()
  })

  it('calculates launch metrics correctly', () => {
    render(<TokenLaunchCalculatorTool />)

    const supplyInput = screen.getByPlaceholderText('1000000000')
    const liquidityInput = screen.getByPlaceholderText('30')
    const ethInput = screen.getByPlaceholderText('10')
    const priceInput = screen.getByPlaceholderText('0.00001')

    fireEvent.change(supplyInput, { target: { value: '1000000000' } })
    fireEvent.change(liquidityInput, { target: { value: '30' } })
    fireEvent.change(ethInput, { target: { value: '10' } })
    fireEvent.change(priceInput, { target: { value: '0.00001' } })

    const calculateButton = screen.getByRole('button', { name: /calculate launch metrics/i })
    fireEvent.click(calculateButton)

    expect(screen.getByText('Tokens for Liquidity Pool')).toBeInTheDocument()
    expect(screen.getByText('Actual Price per Token (ETH)')).toBeInTheDocument()
    expect(screen.getByText('Initial Market Cap (ETH)')).toBeInTheDocument()
    expect(screen.getByText('Fully Diluted Value (ETH)')).toBeInTheDocument()
    expect(screen.getByText('LP Token Value (ETH)')).toBeInTheDocument()
  })

  it('shows token distribution visualization', () => {
    render(<TokenLaunchCalculatorTool />)

    const liquidityInput = screen.getByPlaceholderText('30')
    fireEvent.change(liquidityInput, { target: { value: '30' } })

    expect(screen.getByText('Token Distribution')).toBeInTheDocument()
    expect(screen.getByText(/liquidity pool: 30%/i)).toBeInTheDocument()
    expect(screen.getByText(/remaining: 70/i)).toBeInTheDocument()
  })

  it('shows launch checklist after calculation', () => {
    render(<TokenLaunchCalculatorTool />)

    const supplyInput = screen.getByPlaceholderText('1000000000')
    const liquidityInput = screen.getByPlaceholderText('30')
    const ethInput = screen.getByPlaceholderText('10')
    const priceInput = screen.getByPlaceholderText('0.00001')

    fireEvent.change(supplyInput, { target: { value: '1000000000' } })
    fireEvent.change(liquidityInput, { target: { value: '30' } })
    fireEvent.change(ethInput, { target: { value: '10' } })
    fireEvent.change(priceInput, { target: { value: '0.00001' } })

    const calculateButton = screen.getByRole('button', { name: /calculate launch metrics/i })
    fireEvent.click(calculateButton)

    expect(screen.getByText('Launch Checklist')).toBeInTheDocument()
    expect(screen.getByText(/verify token contract is audited/i)).toBeInTheDocument()
  })

  it('handles reset correctly', () => {
    render(<TokenLaunchCalculatorTool />)

    const supplyInput = screen.getByPlaceholderText('1000000000')
    const liquidityInput = screen.getByPlaceholderText('30')
    const ethInput = screen.getByPlaceholderText('10')
    const priceInput = screen.getByPlaceholderText('0.00001')

    fireEvent.change(supplyInput, { target: { value: '1000000000' } })
    fireEvent.change(liquidityInput, { target: { value: '30' } })
    fireEvent.change(ethInput, { target: { value: '10' } })
    fireEvent.change(priceInput, { target: { value: '0.00001' } })

    const calculateButton = screen.getByRole('button', { name: /calculate launch metrics/i })
    fireEvent.click(calculateButton)

    const resetButton = screen.getByRole('button', { name: /reset calculator/i })
    fireEvent.click(resetButton)

    expect(supplyInput).toHaveValue(null)
    expect(screen.queryByText('Tokens for Liquidity Pool')).not.toBeInTheDocument()
  })

  it('calculates 30% of 1B tokens as 300M', () => {
    render(<TokenLaunchCalculatorTool />)

    const supplyInput = screen.getByPlaceholderText('1000000000')
    const liquidityInput = screen.getByPlaceholderText('30')
    const ethInput = screen.getByPlaceholderText('10')
    const priceInput = screen.getByPlaceholderText('0.00001')

    fireEvent.change(supplyInput, { target: { value: '1000000000' } })
    fireEvent.change(liquidityInput, { target: { value: '30' } })
    fireEvent.change(ethInput, { target: { value: '10' } })
    fireEvent.change(priceInput, { target: { value: '0.00001' } })

    const calculateButton = screen.getByRole('button', { name: /calculate launch metrics/i })
    fireEvent.click(calculateButton)

    // 30% of 1 billion = 300,000,000
    expect(screen.getByDisplayValue('300,000,000')).toBeInTheDocument()
  })

  it('does not calculate with invalid inputs', () => {
    render(<TokenLaunchCalculatorTool />)

    const supplyInput = screen.getByPlaceholderText('1000000000')
    fireEvent.change(supplyInput, { target: { value: '-1000' } })

    const calculateButton = screen.getByRole('button', { name: /calculate launch metrics/i })
    fireEvent.click(calculateButton)

    expect(screen.queryByText('Tokens for Liquidity Pool')).not.toBeInTheDocument()
  })
})
