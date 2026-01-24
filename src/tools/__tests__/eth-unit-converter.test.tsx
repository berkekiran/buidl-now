import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EthUnitConverterTool } from '../eth-unit-converter'

describe('EthUnitConverterTool', () => {
  it('renders without crashing', () => {
    render(<EthUnitConverterTool />)
    expect(screen.getByText('Wei')).toBeInTheDocument()
    expect(screen.getByText('Gwei (Shannon)')).toBeInTheDocument()
    expect(screen.getByText('ETH (Ether)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays unit descriptions', () => {
    render(<EthUnitConverterTool />)
    expect(screen.getByText(/1 Wei = 10⁻¹⁸ ETH/)).toBeInTheDocument()
    expect(screen.getByText(/1 Gwei = 10⁻⁹ ETH = 10⁹ Wei/)).toBeInTheDocument()
    expect(screen.getByText(/1 ETH = 10⁹ Gwei = 10¹⁸ Wei/)).toBeInTheDocument()
  })

  it('converts wei to other units', () => {
    render(<EthUnitConverterTool />)
    const weiInput = screen.getByPlaceholderText('1000000000000000000')

    fireEvent.change(weiInput, { target: { value: '1000000000000000000' } })

    // 1 ETH = 10^18 Wei
    expect(screen.getByDisplayValue('1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1000000000')).toBeInTheDocument() // Gwei
  })

  it('converts gwei to other units', () => {
    render(<EthUnitConverterTool />)
    const gweiInput = screen.getByPlaceholderText('1')

    fireEvent.change(gweiInput, { target: { value: '1000000000' } })

    // 1 ETH = 10^9 Gwei
    const ethInput = screen.getByPlaceholderText('1.0')
    expect(ethInput).toHaveValue('1')
  })

  it('converts eth to other units', () => {
    render(<EthUnitConverterTool />)
    const ethInput = screen.getByPlaceholderText('1.0')

    fireEvent.change(ethInput, { target: { value: '1' } })

    // 1 ETH = 10^18 Wei = 10^9 Gwei
    expect(screen.getByDisplayValue('1000000000000000000')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1000000000')).toBeInTheDocument()
  })

  it('handles zero values', () => {
    render(<EthUnitConverterTool />)
    const ethInput = screen.getByPlaceholderText('1.0')

    fireEvent.change(ethInput, { target: { value: '0' } })

    // All should be 0
    const weiInput = screen.getByPlaceholderText('1000000000000000000')
    const gweiInput = screen.getByPlaceholderText('1')

    expect(weiInput).toHaveValue('0')
    expect(gweiInput).toHaveValue('0')
    expect(ethInput).toHaveValue('0')
  })

  it('resets all fields when reset button is clicked', () => {
    render(<EthUnitConverterTool />)
    const ethInput = screen.getByPlaceholderText('1.0')

    fireEvent.change(ethInput, { target: { value: '1' } })

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(ethInput).toHaveValue('0')
  })

  it('handles decimal eth values', () => {
    render(<EthUnitConverterTool />)
    const ethInput = screen.getByPlaceholderText('1.0')

    fireEvent.change(ethInput, { target: { value: '0.5' } })

    // 0.5 ETH = 5 * 10^17 Wei
    expect(screen.getByDisplayValue('500000000000000000')).toBeInTheDocument()
  })

  it('handles small gwei values', () => {
    render(<EthUnitConverterTool />)
    const gweiInput = screen.getByPlaceholderText('1')

    fireEvent.change(gweiInput, { target: { value: '20' } })

    // 20 Gwei = 20 * 10^9 Wei = 0.00000002 ETH
    expect(screen.getByDisplayValue('20000000000')).toBeInTheDocument() // Wei
  })
})
