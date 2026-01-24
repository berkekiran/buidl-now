import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LineSorterTool } from '../line-sorter'

// Helper to get output textarea (the readonly one)
const getOutputTextarea = () => {
  const textareas = screen.getAllByRole('textbox')
  return textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
}

describe('LineSorterTool', () => {
  it('renders without crashing', () => {
    render(<LineSorterTool />)
    expect(screen.getByText(/input text/i)).toBeInTheDocument()
    expect(screen.getByText('Sort Order')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sort lines/i })).toBeInTheDocument()
  })

  it('has ascending and descending sort options', () => {
    render(<LineSorterTool />)
    expect(screen.getByRole('button', { name: /ascending/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /descending/i })).toBeInTheDocument()
  })

  it('has checkbox options for sorting', () => {
    render(<LineSorterTool />)
    expect(screen.getByText('Case Sensitive')).toBeInTheDocument()
    expect(screen.getByText('Remove Duplicates')).toBeInTheDocument()
    expect(screen.getByText('Remove Empty Lines')).toBeInTheDocument()
  })

  it('sorts lines in ascending order', () => {
    render(<LineSorterTool />)

    const textarea = screen.getByPlaceholderText(/apple.*banana.*cherry/i)
    fireEvent.change(textarea, { target: { value: 'cherry\napple\nbanana' } })

    const sortButton = screen.getByRole('button', { name: /sort lines/i })
    fireEvent.click(sortButton)

    expect(screen.getByText('Sorted Output')).toBeInTheDocument()
    const outputTextarea = getOutputTextarea()
    expect(outputTextarea?.value).toContain('apple')
    expect(outputTextarea?.value).toContain('banana')
    expect(outputTextarea?.value).toContain('cherry')
  })

  it('sorts lines in descending order', () => {
    render(<LineSorterTool />)

    const descButton = screen.getByRole('button', { name: /descending/i })
    fireEvent.click(descButton)

    const textarea = screen.getByPlaceholderText(/apple.*banana.*cherry/i)
    fireEvent.change(textarea, { target: { value: 'apple\nbanana\ncherry' } })

    const sortButton = screen.getByRole('button', { name: /sort lines/i })
    fireEvent.click(sortButton)

    const outputTextarea = getOutputTextarea()
    expect(outputTextarea?.value.indexOf('cherry')).toBeLessThan(outputTextarea?.value.indexOf('apple'))
  })

  it('removes duplicates when option is checked', () => {
    render(<LineSorterTool />)

    // Click the Remove Duplicates checkbox (find by id or name)
    const removeDuplicatesCheckbox = document.getElementById('removeDuplicates') as HTMLInputElement
    expect(removeDuplicatesCheckbox).toBeTruthy()
    fireEvent.click(removeDuplicatesCheckbox)

    const textarea = screen.getByPlaceholderText(/apple.*banana.*cherry/i)
    fireEvent.change(textarea, { target: { value: 'apple\nbanana\napple\ncherry' } })

    const sortButton = screen.getByRole('button', { name: /sort lines/i })
    fireEvent.click(sortButton)

    expect(screen.getByText('Sorted Output')).toBeInTheDocument()
    const outputTextarea = getOutputTextarea()
    // Check duplicates are removed - only one 'apple'
    expect(outputTextarea?.value.match(/apple/g)?.length).toBe(1)
  })

  it('handles reset correctly', () => {
    render(<LineSorterTool />)

    const textarea = screen.getByPlaceholderText(/apple.*banana.*cherry/i)
    fireEvent.change(textarea, { target: { value: 'test\ndata' } })

    const sortButton = screen.getByRole('button', { name: /sort lines/i })
    fireEvent.click(sortButton)

    expect(screen.getByText('Sorted Output')).toBeInTheDocument()

    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)

    expect(textarea).toHaveValue('')
    expect(screen.queryByText('Sorted Output')).not.toBeInTheDocument()
  })

  it('handles empty input', () => {
    render(<LineSorterTool />)

    const sortButton = screen.getByRole('button', { name: /sort lines/i })
    fireEvent.click(sortButton)

    expect(screen.queryByText('Sorted Output')).not.toBeInTheDocument()
  })

  it('removes empty lines by default', () => {
    render(<LineSorterTool />)

    // Find checkbox by id
    const removeEmptyCheckbox = document.getElementById('removeEmptyLines') as HTMLInputElement
    expect(removeEmptyCheckbox).toBeTruthy()
    expect(removeEmptyCheckbox.checked).toBe(true)
  })
})
