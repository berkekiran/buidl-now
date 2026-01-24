import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { JsonToTableTool } from '../json-to-table'

// Helper to get output textarea (readonly one)
const getOutputTextarea = () => {
  const textareas = screen.getAllByRole('textbox')
  return textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
}

describe('JsonToTableTool', () => {
  it('renders without crashing', () => {
    render(<JsonToTableTool />)
    expect(screen.getByText('JSON Array')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /convert to csv/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('converts simple JSON array to CSV', () => {
    render(<JsonToTableTool />)
    const textarea = screen.getByPlaceholderText('[{"name":"John","age":30},{"name":"Jane","age":25}]')

    fireEvent.change(textarea, {
      target: { value: '[{"name":"John","age":30},{"name":"Jane","age":25}]' }
    })

    const convertButton = screen.getByRole('button', { name: /convert to csv/i })
    fireEvent.click(convertButton)

    // Check for CSV output
    expect(screen.getByText('CSV Output')).toBeInTheDocument()
    const output = getOutputTextarea()
    expect(output?.value).toContain('name')
    expect(output?.value).toContain('age')
  })

  it('shows error for non-array JSON', () => {
    render(<JsonToTableTool />)
    const textarea = screen.getByPlaceholderText('[{"name":"John","age":30},{"name":"Jane","age":25}]')

    fireEvent.change(textarea, {
      target: { value: '{"name":"John"}' }
    })

    const convertButton = screen.getByRole('button', { name: /convert to csv/i })
    fireEvent.click(convertButton)

    expect(screen.getByText(/input must be a json array/i)).toBeInTheDocument()
  })

  it('shows error for empty array', () => {
    render(<JsonToTableTool />)
    const textarea = screen.getByPlaceholderText('[{"name":"John","age":30},{"name":"Jane","age":25}]')

    fireEvent.change(textarea, { target: { value: '[]' } })

    const convertButton = screen.getByRole('button', { name: /convert to csv/i })
    fireEvent.click(convertButton)

    expect(screen.getByText(/array is empty/i)).toBeInTheDocument()
  })

  it('shows error for invalid JSON', () => {
    render(<JsonToTableTool />)
    const textarea = screen.getByPlaceholderText('[{"name":"John","age":30},{"name":"Jane","age":25}]')

    fireEvent.change(textarea, { target: { value: 'invalid json' } })

    const convertButton = screen.getByRole('button', { name: /convert to csv/i })
    fireEvent.click(convertButton)

    // Should show an error - just verify the output section is not shown
    expect(screen.queryByText('CSV Output')).not.toBeInTheDocument()
  })

  it('resets input and output when reset button is clicked', () => {
    render(<JsonToTableTool />)
    const textarea = screen.getByPlaceholderText('[{"name":"John","age":30},{"name":"Jane","age":25}]') as HTMLTextAreaElement

    fireEvent.change(textarea, {
      target: { value: '[{"name":"John","age":30}]' }
    })

    const convertButton = screen.getByRole('button', { name: /convert to csv/i })
    fireEvent.click(convertButton)

    // Verify output is shown
    expect(screen.getByText('CSV Output')).toBeInTheDocument()

    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)

    expect(textarea.value).toBe('')
    expect(screen.queryByText('CSV Output')).not.toBeInTheDocument()
  })

  it('handles values with commas by quoting them', () => {
    render(<JsonToTableTool />)
    const textarea = screen.getByPlaceholderText('[{"name":"John","age":30},{"name":"Jane","age":25}]')

    fireEvent.change(textarea, {
      target: { value: '[{"message":"Hello, World!"}]' }
    })

    const convertButton = screen.getByRole('button', { name: /convert to csv/i })
    fireEvent.click(convertButton)

    // Check that the output contains quoted value
    const output = getOutputTextarea()
    expect(output?.value).toContain('"Hello, World!"')
  })

  it('handles null and undefined values', () => {
    render(<JsonToTableTool />)
    const textarea = screen.getByPlaceholderText('[{"name":"John","age":30},{"name":"Jane","age":25}]')

    fireEvent.change(textarea, {
      target: { value: '[{"name":"John","age":null}]' }
    })

    const convertButton = screen.getByRole('button', { name: /convert to csv/i })
    fireEvent.click(convertButton)

    expect(screen.getByText('CSV Output')).toBeInTheDocument()
  })
})
