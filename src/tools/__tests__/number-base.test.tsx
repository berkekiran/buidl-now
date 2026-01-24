import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NumberBaseTool } from '../number-base'

describe('NumberBaseTool', () => {
  it('renders without crashing', () => {
    render(<NumberBaseTool />)
    expect(screen.getByText('Decimal (Base 10)')).toBeInTheDocument()
    expect(screen.getByText('Binary (Base 2)')).toBeInTheDocument()
    expect(screen.getByText('Octal (Base 8)')).toBeInTheDocument()
    expect(screen.getByText('Hexadecimal (Base 16)')).toBeInTheDocument()
  })

  it('converts decimal to other bases', () => {
    render(<NumberBaseTool />)
    const decimalInput = screen.getByPlaceholderText('42')

    fireEvent.change(decimalInput, { target: { value: '42' } })

    // All inputs should be updated
    const binaryInput = screen.getByPlaceholderText('101010')
    const octalInput = screen.getByPlaceholderText('52')
    const hexInput = screen.getByPlaceholderText('2A')

    expect(binaryInput).toHaveValue('101010')
    expect(octalInput).toHaveValue('52')
    expect(hexInput).toHaveValue('2A')
  })

  it('converts binary to other bases', () => {
    render(<NumberBaseTool />)
    const binaryInput = screen.getByPlaceholderText('101010')

    fireEvent.change(binaryInput, { target: { value: '11111111' } })

    const decimalInput = screen.getByPlaceholderText('42')
    const octalInput = screen.getByPlaceholderText('52')
    const hexInput = screen.getByPlaceholderText('2A')

    expect(decimalInput).toHaveValue('255')
    expect(octalInput).toHaveValue('377')
    expect(hexInput).toHaveValue('FF')
  })

  it('converts hexadecimal to other bases', () => {
    render(<NumberBaseTool />)
    const hexInput = screen.getByPlaceholderText('2A')

    fireEvent.change(hexInput, { target: { value: 'FF' } })

    const decimalInput = screen.getByPlaceholderText('42')
    const binaryInput = screen.getByPlaceholderText('101010')
    const octalInput = screen.getByPlaceholderText('52')

    expect(decimalInput).toHaveValue('255')
    expect(binaryInput).toHaveValue('11111111')
    expect(octalInput).toHaveValue('377')
  })

  it('converts octal to other bases', () => {
    render(<NumberBaseTool />)
    const octalInput = screen.getByPlaceholderText('52')

    fireEvent.change(octalInput, { target: { value: '52' } })

    const decimalInput = screen.getByPlaceholderText('42')
    const binaryInput = screen.getByPlaceholderText('101010')
    const hexInput = screen.getByPlaceholderText('2A')

    expect(decimalInput).toHaveValue('42')
    expect(binaryInput).toHaveValue('101010')
    expect(hexInput).toHaveValue('2A')
  })

  it('resets all values when reset button is clicked', () => {
    render(<NumberBaseTool />)
    const decimalInput = screen.getByPlaceholderText('42')

    fireEvent.change(decimalInput, { target: { value: '42' } })

    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)

    expect(decimalInput).toHaveValue('0')
    expect(screen.getByPlaceholderText('101010')).toHaveValue('0')
    expect(screen.getByPlaceholderText('52')).toHaveValue('0')
    expect(screen.getByPlaceholderText('2A')).toHaveValue('0')
  })

  it('handles zero input correctly', () => {
    render(<NumberBaseTool />)
    const decimalInput = screen.getByPlaceholderText('42')

    fireEvent.change(decimalInput, { target: { value: '0' } })

    expect(decimalInput).toHaveValue('0')
    expect(screen.getByPlaceholderText('101010')).toHaveValue('0')
    expect(screen.getByPlaceholderText('52')).toHaveValue('0')
    expect(screen.getByPlaceholderText('2A')).toHaveValue('0')
  })
})
