import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TokenDecimalsConverterTool } from '../token-decimals-converter'

describe('TokenDecimalsConverterTool', () => {
  it('renders without crashing', () => {
    render(<TokenDecimalsConverterTool />)
    expect(screen.getByText('Decimals')).toBeInTheDocument()
    expect(screen.getByText('Human Readable \u2192 Raw')).toBeInTheDocument()
    expect(screen.getByText('Raw \u2192 Human Readable')).toBeInTheDocument()
  })

  it('shows default 18 decimals', () => {
    render(<TokenDecimalsConverterTool />)
    const decimalsInput = screen.getByPlaceholderText('18')
    expect(decimalsInput).toHaveValue(18)
  })

  it('converts human readable to raw (1 ETH)', () => {
    render(<TokenDecimalsConverterTool />)
    const inputs = screen.getAllByRole('textbox')
    const amountInput = inputs.find(i => (i as HTMLInputElement).placeholder === '1.0')!
    fireEvent.change(amountInput, { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Convert to Raw' }))

    const rawOutput = screen.getByPlaceholderText('1000000000000000000')
    expect(rawOutput).toHaveValue('1000000000000000000')
  })

  it('converts human readable to raw with decimals', () => {
    render(<TokenDecimalsConverterTool />)
    const inputs = screen.getAllByRole('textbox')
    const amountInput = inputs.find(i => (i as HTMLInputElement).placeholder === '1.0')!
    fireEvent.change(amountInput, { target: { value: '1.5' } })
    fireEvent.click(screen.getByRole('button', { name: 'Convert to Raw' }))

    const rawOutput = screen.getByPlaceholderText('1000000000000000000')
    expect(rawOutput).toHaveValue('1500000000000000000')
  })

  it('converts raw to human readable', () => {
    render(<TokenDecimalsConverterTool />)
    const rawInput = screen.getByPlaceholderText('1000000000000000000')
    fireEvent.change(rawInput, { target: { value: '1000000000000000000' } })
    fireEvent.click(screen.getByRole('button', { name: 'Convert to Human Readable' }))

    // The Human Readable Amount output has a different placeholder
    const outputs = screen.getAllByRole('textbox')
    // Find the output that now has "1" value
    const humanOutput = outputs.find(el => (el as HTMLInputElement).value === '1')
    expect(humanOutput).toBeDefined()
  })

  it('works with 6 decimals (USDC style)', () => {
    render(<TokenDecimalsConverterTool />)
    const decimalsInput = screen.getByPlaceholderText('18')
    fireEvent.change(decimalsInput, { target: { value: '6' } })

    const inputs = screen.getAllByRole('textbox')
    const amountInput = inputs.find(i => (i as HTMLInputElement).placeholder === '1.0')!
    fireEvent.change(amountInput, { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Convert to Raw' }))

    const rawOutput = screen.getByPlaceholderText('1000000000000000000')
    expect(rawOutput).toHaveValue('1000000')
  })

  it('handles zero decimals', () => {
    render(<TokenDecimalsConverterTool />)
    const decimalsInput = screen.getByPlaceholderText('18')
    fireEvent.change(decimalsInput, { target: { value: '0' } })

    const inputs = screen.getAllByRole('textbox')
    const amountInput = inputs.find(i => (i as HTMLInputElement).placeholder === '1.0')!
    fireEvent.change(amountInput, { target: { value: '100' } })
    fireEvent.click(screen.getByRole('button', { name: 'Convert to Raw' }))

    const rawOutput = screen.getByPlaceholderText('1000000000000000000')
    expect(rawOutput).toHaveValue('100')
  })

  it('shows error for invalid decimals', () => {
    render(<TokenDecimalsConverterTool />)
    const decimalsInput = screen.getByPlaceholderText('18')
    fireEvent.change(decimalsInput, { target: { value: '100' } })

    const inputs = screen.getAllByRole('textbox')
    const amountInput = inputs.find(i => (i as HTMLInputElement).placeholder === '1.0')!
    fireEvent.change(amountInput, { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Convert to Raw' }))

    const rawOutput = screen.getByPlaceholderText('1000000000000000000')
    expect(rawOutput).toHaveValue('Invalid decimals (0-77)')
  })

  it('resets the form', () => {
    render(<TokenDecimalsConverterTool />)
    const inputs = screen.getAllByRole('textbox')
    const amountInput = inputs.find(i => (i as HTMLInputElement).placeholder === '1.0')!
    fireEvent.change(amountInput, { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Convert to Raw' }))
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(amountInput).toHaveValue('')
    const rawOutput = screen.getByPlaceholderText('1000000000000000000')
    expect(rawOutput).toHaveValue('')
  })

  it('shows info text about common decimals', () => {
    render(<TokenDecimalsConverterTool />)
    expect(screen.getByText(/Common: 18 for ETH, 6 for USDC/)).toBeInTheDocument()
  })
})
