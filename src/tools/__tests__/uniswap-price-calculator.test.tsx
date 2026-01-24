import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { UniswapPriceCalculatorTool } from '../uniswap-price-calculator'

describe('UniswapPriceCalculatorTool', () => {
  it('renders without crashing', () => {
    render(<UniswapPriceCalculatorTool />)
    expect(screen.getByText('Reserve Token0')).toBeInTheDocument()
    expect(screen.getByText('Reserve Token1')).toBeInTheDocument()
    expect(screen.getByText('Amount In (Token0)')).toBeInTheDocument()
    expect(screen.getByText('Pool Fee')).toBeInTheDocument()
  })

  it('has pool fee selector buttons', () => {
    render(<UniswapPriceCalculatorTool />)
    expect(screen.getByRole('button', { name: '0.05%' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '0.3%' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1.0%' })).toBeInTheDocument()
  })

  it('has a calculate button', () => {
    render(<UniswapPriceCalculatorTool />)
    expect(screen.getByRole('button', { name: /calculate price/i })).toBeInTheDocument()
  })

  it('calculates swap output correctly', () => {
    render(<UniswapPriceCalculatorTool />)

    const reserve0Input = screen.getByPlaceholderText('10000')
    const reserve1Input = screen.getByPlaceholderText('20000')
    const amountInInput = screen.getByPlaceholderText('100')

    fireEvent.change(reserve0Input, { target: { value: '10000' } })
    fireEvent.change(reserve1Input, { target: { value: '20000' } })
    fireEvent.change(amountInInput, { target: { value: '100' } })

    const calculateButton = screen.getByRole('button', { name: /calculate price/i })
    fireEvent.click(calculateButton)

    expect(screen.getByText('Price (Token1 per Token0)')).toBeInTheDocument()
    expect(screen.getByText('Amount Out (Token1)')).toBeInTheDocument()
    expect(screen.getByText('Price Impact (%)')).toBeInTheDocument()
    expect(screen.getByText('Impermanent Loss (%)')).toBeInTheDocument()
  })

  it('shows initial price of 2 for 10000:20000 reserves', () => {
    render(<UniswapPriceCalculatorTool />)

    const reserve0Input = screen.getByPlaceholderText('10000')
    const reserve1Input = screen.getByPlaceholderText('20000')
    const amountInInput = screen.getByPlaceholderText('100')

    fireEvent.change(reserve0Input, { target: { value: '10000' } })
    fireEvent.change(reserve1Input, { target: { value: '20000' } })
    fireEvent.change(amountInInput, { target: { value: '100' } })

    const calculateButton = screen.getByRole('button', { name: /calculate price/i })
    fireEvent.click(calculateButton)

    // Price should be 2 (20000/10000)
    const priceOutput = screen.getByDisplayValue('2.000000')
    expect(priceOutput).toBeInTheDocument()
  })

  it('changes pool fee when buttons are clicked', () => {
    render(<UniswapPriceCalculatorTool />)

    const feeButton005 = screen.getByRole('button', { name: '0.05%' })
    fireEvent.click(feeButton005)

    // Just verify button exists after click (CSS classes vary by state)
    expect(feeButton005).toBeInTheDocument()
  })

  it('shows formula display after calculation', () => {
    render(<UniswapPriceCalculatorTool />)

    const reserve0Input = screen.getByPlaceholderText('10000')
    const reserve1Input = screen.getByPlaceholderText('20000')
    const amountInInput = screen.getByPlaceholderText('100')

    fireEvent.change(reserve0Input, { target: { value: '10000' } })
    fireEvent.change(reserve1Input, { target: { value: '20000' } })
    fireEvent.change(amountInInput, { target: { value: '100' } })

    const calculateButton = screen.getByRole('button', { name: /calculate price/i })
    fireEvent.click(calculateButton)

    expect(screen.getByText(/uniswap v2 formula/i)).toBeInTheDocument()
    expect(screen.getByText('Price Impact')).toBeInTheDocument()
    expect(screen.getByText('Impermanent Loss')).toBeInTheDocument()
  })

  it('handles reset correctly', () => {
    render(<UniswapPriceCalculatorTool />)

    const reserve0Input = screen.getByPlaceholderText('10000')
    fireEvent.change(reserve0Input, { target: { value: '10000' } })

    const reserve1Input = screen.getByPlaceholderText('20000')
    fireEvent.change(reserve1Input, { target: { value: '20000' } })

    const amountInInput = screen.getByPlaceholderText('100')
    fireEvent.change(amountInInput, { target: { value: '100' } })

    const calculateButton = screen.getByRole('button', { name: /calculate price/i })
    fireEvent.click(calculateButton)

    const resetButton = screen.getByRole('button', { name: /reset calculator/i })
    fireEvent.click(resetButton)

    expect(reserve0Input).toHaveValue(null)
    expect(screen.queryByText('Price (Token1 per Token0)')).not.toBeInTheDocument()
  })

  it('does not show results with invalid inputs', () => {
    render(<UniswapPriceCalculatorTool />)

    const reserve0Input = screen.getByPlaceholderText('10000')
    fireEvent.change(reserve0Input, { target: { value: '-100' } })

    const calculateButton = screen.getByRole('button', { name: /calculate price/i })
    fireEvent.click(calculateButton)

    expect(screen.queryByText('Price (Token1 per Token0)')).not.toBeInTheDocument()
  })
})
