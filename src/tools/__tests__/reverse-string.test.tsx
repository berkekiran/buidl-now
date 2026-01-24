import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ReverseStringTool } from '../reverse-string'

describe('ReverseStringTool', () => {
  it('renders without crashing', () => {
    render(<ReverseStringTool />)
    expect(screen.getByText('Input Text')).toBeInTheDocument()
    expect(screen.getByText('Reversed Text')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Swap Input/Output' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('reverses simple text', () => {
    render(<ReverseStringTool />)
    const input = screen.getByPlaceholderText('Enter text to reverse...')
    fireEvent.change(input, { target: { value: 'Hello' } })

    expect(screen.getByDisplayValue('olleH')).toBeInTheDocument()
  })

  it('reverses text with spaces', () => {
    render(<ReverseStringTool />)
    const input = screen.getByPlaceholderText('Enter text to reverse...')
    fireEvent.change(input, { target: { value: 'Hello World' } })

    expect(screen.getByDisplayValue('dlroW olleH')).toBeInTheDocument()
  })

  it('handles palindromes', () => {
    render(<ReverseStringTool />)
    const input = screen.getByPlaceholderText('Enter text to reverse...')
    fireEvent.change(input, { target: { value: 'racecar' } })

    // Both input and output show 'racecar'
    const textareas = screen.getAllByDisplayValue('racecar')
    expect(textareas.length).toBe(2)
  })

  it('reverses numbers', () => {
    render(<ReverseStringTool />)
    const input = screen.getByPlaceholderText('Enter text to reverse...')
    fireEvent.change(input, { target: { value: '12345' } })

    expect(screen.getByDisplayValue('54321')).toBeInTheDocument()
  })

  it('reverses mixed characters', () => {
    render(<ReverseStringTool />)
    const input = screen.getByPlaceholderText('Enter text to reverse...')
    fireEvent.change(input, { target: { value: 'ABC123' } })

    expect(screen.getByDisplayValue('321CBA')).toBeInTheDocument()
  })

  it('shows character count', () => {
    render(<ReverseStringTool />)
    const input = screen.getByPlaceholderText('Enter text to reverse...')
    fireEvent.change(input, { target: { value: 'Hello World' } })

    expect(screen.getByText('11')).toBeInTheDocument()
    expect(screen.getByText('Characters')).toBeInTheDocument()
  })

  it('shows word count', () => {
    render(<ReverseStringTool />)
    const input = screen.getByPlaceholderText('Enter text to reverse...')
    fireEvent.change(input, { target: { value: 'Hello World' } })

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Words')).toBeInTheDocument()
  })

  it('swaps input and output', () => {
    render(<ReverseStringTool />)
    const input = screen.getByPlaceholderText('Enter text to reverse...')
    fireEvent.change(input, { target: { value: 'Hello' } })

    fireEvent.click(screen.getByRole('button', { name: 'Swap Input/Output' }))
    expect(input).toHaveValue('olleH')
  })

  it('resets the form', () => {
    render(<ReverseStringTool />)
    const input = screen.getByPlaceholderText('Enter text to reverse...')
    fireEvent.change(input, { target: { value: 'Hello' } })
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(input).toHaveValue('')
  })

  it('disables swap button when output is empty', () => {
    render(<ReverseStringTool />)
    const swapButton = screen.getByRole('button', { name: 'Swap Input/Output' })
    expect(swapButton).toBeDisabled()
  })

  it('clears output when input is cleared', () => {
    render(<ReverseStringTool />)
    const input = screen.getByPlaceholderText('Enter text to reverse...')
    fireEvent.change(input, { target: { value: 'Hello' } })

    expect(screen.getByDisplayValue('olleH')).toBeInTheDocument()

    fireEvent.change(input, { target: { value: '' } })
    expect(screen.queryByDisplayValue('olleH')).not.toBeInTheDocument()
  })
})
