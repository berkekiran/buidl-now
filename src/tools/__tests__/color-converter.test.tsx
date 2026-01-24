import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ColorConverterTool } from '../color-converter'

// Helper to get readonly input values
const getReadonlyInputValues = () => {
  const inputs = screen.getAllByRole('textbox')
  return inputs.filter(i => i.hasAttribute('readonly')).map(i => (i as HTMLInputElement).value)
}

describe('ColorConverterTool', () => {
  it('renders without crashing', () => {
    render(<ColorConverterTool />)
    expect(screen.getByText('Color Input')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Convert' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('handles empty input', () => {
    render(<ColorConverterTool />)
    fireEvent.click(screen.getByRole('button', { name: 'Convert' }))
    expect(screen.getByText('Please enter a color value')).toBeInTheDocument()
  })

  it('converts HEX color to all formats', () => {
    render(<ColorConverterTool />)
    const input = screen.getByPlaceholderText(/e.g., #FF5733/)
    fireEvent.change(input, { target: { value: '#FF5733' } })
    fireEvent.click(screen.getByRole('button', { name: 'Convert' }))

    expect(screen.getByText('Color Preview')).toBeInTheDocument()
    const values = getReadonlyInputValues()
    expect(values.some(v => v.includes('#FF5733') || v.includes('#ff5733'))).toBe(true)
  })

  it('converts RGB color to all formats', () => {
    render(<ColorConverterTool />)
    const input = screen.getByPlaceholderText(/e.g., #FF5733/)
    fireEvent.change(input, { target: { value: 'rgb(0, 128, 255)' } })
    fireEvent.click(screen.getByRole('button', { name: 'Convert' }))

    expect(screen.getByText('Color Preview')).toBeInTheDocument()
    const values = getReadonlyInputValues()
    expect(values.some(v => v.includes('0080') || v.includes('rgb'))).toBe(true)
  })

  it('converts HSL color to all formats', () => {
    render(<ColorConverterTool />)
    const input = screen.getByPlaceholderText(/e.g., #FF5733/)
    fireEvent.change(input, { target: { value: 'hsl(120, 100, 50)' } })
    fireEvent.click(screen.getByRole('button', { name: 'Convert' }))

    expect(screen.getByText('Color Preview')).toBeInTheDocument()
  })

  it('shows error for invalid color format', () => {
    render(<ColorConverterTool />)
    const input = screen.getByPlaceholderText(/e.g., #FF5733/)
    fireEvent.change(input, { target: { value: 'invalid-color' } })
    fireEvent.click(screen.getByRole('button', { name: 'Convert' }))

    expect(screen.getByText(/Invalid color format/)).toBeInTheDocument()
  })

  it('resets the form', () => {
    render(<ColorConverterTool />)
    const input = screen.getByPlaceholderText(/e.g., #FF5733/)
    fireEvent.change(input, { target: { value: '#FF5733' } })
    fireEvent.click(screen.getByRole('button', { name: 'Convert' }))
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(input).toHaveValue('')
    expect(screen.queryByText('Color Preview')).not.toBeInTheDocument()
  })

  it('handles HEX without hash prefix', () => {
    render(<ColorConverterTool />)
    const input = screen.getByPlaceholderText(/e.g., #FF5733/)
    fireEvent.change(input, { target: { value: 'FF5733' } })
    fireEvent.click(screen.getByRole('button', { name: 'Convert' }))

    expect(screen.getByText('Color Preview')).toBeInTheDocument()
  })
})
