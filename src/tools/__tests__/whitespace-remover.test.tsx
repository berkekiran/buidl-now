import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WhitespaceRemoverTool } from '../whitespace-remover'

// Helper to get output textarea (readonly one)
const getOutputTextarea = () => {
  const textareas = screen.getAllByRole('textbox')
  return textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
}

describe('WhitespaceRemoverTool', () => {
  it('renders without crashing', () => {
    render(<WhitespaceRemoverTool />)
    expect(screen.getByText('Input Text')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Trim Lines' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Normalize' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('shows description of actions', () => {
    render(<WhitespaceRemoverTool />)
    expect(screen.getByText(/Trim Lines:/)).toBeInTheDocument()
    expect(screen.getByText(/Remove All:/)).toBeInTheDocument()
    expect(screen.getByText(/Normalize:/)).toBeInTheDocument()
  })

  it('trims lines', () => {
    render(<WhitespaceRemoverTool />)
    const input = screen.getByPlaceholderText('Enter text with whitespace...')
    fireEvent.change(input, { target: { value: '  hello  \n  world  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Trim Lines' }))

    const output = getOutputTextarea()
    expect(output?.value).toContain('hello')
    expect(output?.value).toContain('world')
    expect(output?.value).not.toContain('  hello')
  })

  it('removes all whitespace', () => {
    render(<WhitespaceRemoverTool />)
    const input = screen.getByPlaceholderText('Enter text with whitespace...')
    fireEvent.change(input, { target: { value: 'hello world\nfoo bar' } })
    fireEvent.click(screen.getByRole('button', { name: 'Remove All' }))

    const output = getOutputTextarea()
    expect(output?.value).toBe('helloworldfoobar')
  })

  it('normalizes whitespace', () => {
    render(<WhitespaceRemoverTool />)
    const input = screen.getByPlaceholderText('Enter text with whitespace...')
    fireEvent.change(input, { target: { value: '  hello    world  \n\n  foo   bar  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Normalize' }))

    const output = getOutputTextarea()
    expect(output?.value).toContain('hello world')
    expect(output?.value).toContain('foo bar')
    expect(output?.value).not.toContain('  ')
  })

  it('handles tabs in trim lines', () => {
    render(<WhitespaceRemoverTool />)
    const input = screen.getByPlaceholderText('Enter text with whitespace...')
    fireEvent.change(input, { target: { value: '\thello\t\n\tworld\t' } })
    fireEvent.click(screen.getByRole('button', { name: 'Trim Lines' }))

    const output = getOutputTextarea()
    expect(output?.value).toContain('hello')
    expect(output?.value).toContain('world')
  })

  it('removes empty lines in normalize', () => {
    render(<WhitespaceRemoverTool />)
    const input = screen.getByPlaceholderText('Enter text with whitespace...')
    fireEvent.change(input, { target: { value: 'hello\n\n\nworld' } })
    fireEvent.click(screen.getByRole('button', { name: 'Normalize' }))

    const output = getOutputTextarea()
    expect(output?.value).toContain('hello')
    expect(output?.value).toContain('world')
  })

  it('handles empty input', () => {
    render(<WhitespaceRemoverTool />)
    fireEvent.click(screen.getByRole('button', { name: 'Trim Lines' }))
    expect(screen.queryByText('Output')).not.toBeInTheDocument()
  })

  it('resets the form', () => {
    render(<WhitespaceRemoverTool />)
    const input = screen.getByPlaceholderText('Enter text with whitespace...')
    fireEvent.change(input, { target: { value: '  hello  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Trim Lines' }))
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

    expect(input).toHaveValue('')
    expect(screen.queryByText('Output')).not.toBeInTheDocument()
  })

  it('handles multiple spaces in remove all', () => {
    render(<WhitespaceRemoverTool />)
    const input = screen.getByPlaceholderText('Enter text with whitespace...')
    fireEvent.change(input, { target: { value: 'a    b    c' } })
    fireEvent.click(screen.getByRole('button', { name: 'Remove All' }))

    const output = getOutputTextarea()
    expect(output?.value).toBe('abc')
  })

  it('preserves newlines in trim lines', () => {
    render(<WhitespaceRemoverTool />)
    const input = screen.getByPlaceholderText('Enter text with whitespace...')
    fireEvent.change(input, { target: { value: 'line1\nline2\nline3' } })
    fireEvent.click(screen.getByRole('button', { name: 'Trim Lines' }))

    const output = getOutputTextarea()
    expect(output?.value).toContain('line1')
    expect(output?.value).toContain('line2')
    expect(output?.value).toContain('line3')
  })
})
