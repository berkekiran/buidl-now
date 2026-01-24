import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ListComparerTool } from '../list-comparer'

describe('ListComparerTool', () => {
  it('renders without crashing', () => {
    render(<ListComparerTool />)
    expect(screen.getByText('List 1 (one item per line)')).toBeInTheDocument()
    expect(screen.getByText('List 2 (one item per line)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /compare lists/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('compares two lists and shows results', () => {
    render(<ListComparerTool />)
    const textareas = screen.getAllByRole('textbox')
    const list1Textarea = textareas[0]
    const list2Textarea = textareas[1]

    fireEvent.change(list1Textarea, { target: { value: 'apple\nbanana\norange' } })
    fireEvent.change(list2Textarea, { target: { value: 'banana\ngrape\norange' } })

    const compareButton = screen.getByRole('button', { name: /compare lists/i })
    fireEvent.click(compareButton)

    // Check for result sections
    expect(screen.getByText(/Only in List 1/)).toBeInTheDocument()
    expect(screen.getByText(/Only in List 2/)).toBeInTheDocument()
    expect(screen.getByText(/In Both Lists/)).toBeInTheDocument()
  })

  it('shows items only in list 1', () => {
    render(<ListComparerTool />)
    const textareas = screen.getAllByRole('textbox')
    const list1Textarea = textareas[0]
    const list2Textarea = textareas[1]

    fireEvent.change(list1Textarea, { target: { value: 'apple\nbanana' } })
    fireEvent.change(list2Textarea, { target: { value: 'banana\ngrape' } })

    const compareButton = screen.getByRole('button', { name: /compare lists/i })
    fireEvent.click(compareButton)

    // apple should be in "Only in List 1"
    expect(screen.getByText('apple')).toBeInTheDocument()
  })

  it('shows items only in list 2', () => {
    render(<ListComparerTool />)
    const textareas = screen.getAllByRole('textbox')
    const list1Textarea = textareas[0]
    const list2Textarea = textareas[1]

    fireEvent.change(list1Textarea, { target: { value: 'apple\nbanana' } })
    fireEvent.change(list2Textarea, { target: { value: 'banana\ngrape' } })

    const compareButton = screen.getByRole('button', { name: /compare lists/i })
    fireEvent.click(compareButton)

    // grape should be in "Only in List 2"
    expect(screen.getByText('grape')).toBeInTheDocument()
  })

  it('shows items in both lists', () => {
    render(<ListComparerTool />)
    const textareas = screen.getAllByRole('textbox')
    const list1Textarea = textareas[0]
    const list2Textarea = textareas[1]

    fireEvent.change(list1Textarea, { target: { value: 'apple\nbanana' } })
    fireEvent.change(list2Textarea, { target: { value: 'banana\ngrape' } })

    const compareButton = screen.getByRole('button', { name: /compare lists/i })
    fireEvent.click(compareButton)

    // banana should be in "In Both Lists"
    expect(screen.getByText('banana')).toBeInTheDocument()
  })

  it('displays correct counts', () => {
    render(<ListComparerTool />)
    const textareas = screen.getAllByRole('textbox')
    const list1Textarea = textareas[0]
    const list2Textarea = textareas[1]

    fireEvent.change(list1Textarea, { target: { value: 'apple\nbanana\norange' } })
    fireEvent.change(list2Textarea, { target: { value: 'banana\ngrape\norange' } })

    const compareButton = screen.getByRole('button', { name: /compare lists/i })
    fireEvent.click(compareButton)

    // Check counts
    expect(screen.getByText('Only in List 1 (1)')).toBeInTheDocument()
    expect(screen.getByText('Only in List 2 (1)')).toBeInTheDocument()
    expect(screen.getByText('In Both Lists (2)')).toBeInTheDocument()
  })

  it('resets all values when reset button is clicked', () => {
    render(<ListComparerTool />)
    const textareas = screen.getAllByRole('textbox')
    const list1Textarea = textareas[0] as HTMLTextAreaElement
    const list2Textarea = textareas[1] as HTMLTextAreaElement

    fireEvent.change(list1Textarea, { target: { value: 'apple\nbanana' } })
    fireEvent.change(list2Textarea, { target: { value: 'banana\ngrape' } })

    const compareButton = screen.getByRole('button', { name: /compare lists/i })
    fireEvent.click(compareButton)

    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)

    expect(list1Textarea.value).toBe('')
    expect(list2Textarea.value).toBe('')
    expect(screen.queryByText('Only in List 1')).not.toBeInTheDocument()
  })

  it('handles empty lists gracefully', () => {
    render(<ListComparerTool />)

    const compareButton = screen.getByRole('button', { name: /compare lists/i })
    fireEvent.click(compareButton)

    // Should not show results for empty lists
    expect(screen.queryByText(/Only in List 1/)).not.toBeInTheDocument()
  })

  it('trims whitespace from list items', () => {
    render(<ListComparerTool />)
    const textareas = screen.getAllByRole('textbox')
    const list1Textarea = textareas[0]
    const list2Textarea = textareas[1]

    fireEvent.change(list1Textarea, { target: { value: '  apple  \n  banana  ' } })
    fireEvent.change(list2Textarea, { target: { value: 'banana\ngrape' } })

    const compareButton = screen.getByRole('button', { name: /compare lists/i })
    fireEvent.click(compareButton)

    // banana should match despite whitespace
    expect(screen.getByText('banana')).toBeInTheDocument()
  })

  it('has copy buttons for results', () => {
    render(<ListComparerTool />)
    const textareas = screen.getAllByRole('textbox')
    const list1Textarea = textareas[0]
    const list2Textarea = textareas[1]

    fireEvent.change(list1Textarea, { target: { value: 'apple\nbanana' } })
    fireEvent.change(list2Textarea, { target: { value: 'banana\ngrape' } })

    const compareButton = screen.getByRole('button', { name: /compare lists/i })
    fireEvent.click(compareButton)

    // Should have copy buttons
    const copyButtons = screen.getAllByTitle('Copy to clipboard')
    expect(copyButtons.length).toBeGreaterThan(0)
  })
})
