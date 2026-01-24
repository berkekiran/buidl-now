import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { JsonFormatterTool } from '../json-formatter'

describe('JsonFormatterTool', () => {
  it('renders without crashing', () => {
    render(<JsonFormatterTool />)
    expect(screen.getByText('JSON Input')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Format/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Minify' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays placeholder text', () => {
    render(<JsonFormatterTool />)
    expect(screen.getByPlaceholderText('{"name":"John","age":30}')).toBeInTheDocument()
  })

  it('formats valid JSON', () => {
    render(<JsonFormatterTool />)
    const input = screen.getByPlaceholderText('{"name":"John","age":30}')
    const formatButton = screen.getByRole('button', { name: /Format/ })

    fireEvent.change(input, { target: { value: '{"name":"John","age":30}' } })
    fireEvent.click(formatButton)

    expect(screen.getByText('Valid JSON')).toBeInTheDocument()
    expect(screen.getByText('Formatted JSON')).toBeInTheDocument()
  })

  it('shows formatted output with indentation', () => {
    render(<JsonFormatterTool />)
    const input = screen.getByPlaceholderText('{"name":"John","age":30}')
    const formatButton = screen.getByRole('button', { name: /Format/ })

    fireEvent.change(input, { target: { value: '{"name":"John","age":30}' } })
    fireEvent.click(formatButton)

    const output = screen.getAllByRole('textbox').find(el => el.hasAttribute('readonly'))
    if (output) {
      const value = (output as HTMLTextAreaElement).value
      expect(value).toContain('\n')
      expect(value).toContain('  ')
    }
  })

  it('minifies JSON', () => {
    render(<JsonFormatterTool />)
    const input = screen.getByPlaceholderText('{"name":"John","age":30}')
    const minifyButton = screen.getByRole('button', { name: 'Minify' })

    const prettyJson = `{
  "name": "John",
  "age": 30
}`

    fireEvent.change(input, { target: { value: prettyJson } })
    fireEvent.click(minifyButton)

    expect(screen.getByText('Valid JSON')).toBeInTheDocument()
    const output = screen.getAllByRole('textbox').find(el => el.hasAttribute('readonly'))
    if (output) {
      const value = (output as HTMLTextAreaElement).value
      expect(value).toBe('{"name":"John","age":30}')
    }
  })

  it('shows error for invalid JSON', () => {
    render(<JsonFormatterTool />)
    const input = screen.getByPlaceholderText('{"name":"John","age":30}')
    const formatButton = screen.getByRole('button', { name: /Format/ })

    fireEvent.change(input, { target: { value: '{"name": "John", age: 30}' } })
    fireEvent.click(formatButton)

    expect(screen.getByText(/Invalid JSON/)).toBeInTheDocument()
  })

  it('shows error for missing comma', () => {
    render(<JsonFormatterTool />)
    const input = screen.getByPlaceholderText('{"name":"John","age":30}')
    const formatButton = screen.getByRole('button', { name: /Format/ })

    fireEvent.change(input, { target: { value: '{"name": "John" "age": 30}' } })
    fireEvent.click(formatButton)

    expect(screen.getByText(/Invalid JSON/)).toBeInTheDocument()
  })

  it('resets all fields when reset button is clicked', () => {
    render(<JsonFormatterTool />)
    const input = screen.getByPlaceholderText('{"name":"John","age":30}')
    const formatButton = screen.getByRole('button', { name: /Format/ })

    fireEvent.change(input, { target: { value: '{"name":"John"}' } })
    fireEvent.click(formatButton)

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(input).toHaveValue('')
    expect(screen.queryByText('Valid JSON')).not.toBeInTheDocument()
    expect(screen.queryByText('Formatted JSON')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<JsonFormatterTool />)
    const formatButton = screen.getByRole('button', { name: /Format/ })

    fireEvent.click(formatButton)

    // Should not show any validation message
    expect(screen.queryByText('Valid JSON')).not.toBeInTheDocument()
    expect(screen.queryByText(/Invalid JSON/)).not.toBeInTheDocument()
  })

  it('formats array JSON', () => {
    render(<JsonFormatterTool />)
    const input = screen.getByPlaceholderText('{"name":"John","age":30}')
    const formatButton = screen.getByRole('button', { name: /Format/ })

    fireEvent.change(input, { target: { value: '[1,2,3,4,5]' } })
    fireEvent.click(formatButton)

    expect(screen.getByText('Valid JSON')).toBeInTheDocument()
  })

  it('formats nested JSON', () => {
    render(<JsonFormatterTool />)
    const input = screen.getByPlaceholderText('{"name":"John","age":30}')
    const formatButton = screen.getByRole('button', { name: /Format/ })

    fireEvent.change(input, { target: { value: '{"user":{"name":"Jane","profile":{"age":25}}}' } })
    fireEvent.click(formatButton)

    expect(screen.getByText('Valid JSON')).toBeInTheDocument()
    const output = screen.getAllByRole('textbox').find(el => el.hasAttribute('readonly'))
    if (output) {
      const value = (output as HTMLTextAreaElement).value
      expect(value).toContain('user')
      expect(value).toContain('profile')
    }
  })

  it('handles trailing comma error', () => {
    render(<JsonFormatterTool />)
    const input = screen.getByPlaceholderText('{"name":"John","age":30}')
    const formatButton = screen.getByRole('button', { name: /Format/ })

    fireEvent.change(input, { target: { value: '{"name": "John",}' } })
    fireEvent.click(formatButton)

    expect(screen.getByText(/Invalid JSON/)).toBeInTheDocument()
  })
})
