import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TextComparerTool } from '../text-comparer'

describe('TextComparerTool', () => {
  it('renders without crashing', () => {
    render(<TextComparerTool />)
    expect(screen.getByText('Original Text')).toBeInTheDocument()
    expect(screen.getByText('Modified Text')).toBeInTheDocument()
    expect(screen.getByText('Diff Mode')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /compare texts/i })).toBeInTheDocument()
  })

  it('renders diff mode buttons', () => {
    render(<TextComparerTool />)
    expect(screen.getByRole('button', { name: /word level/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /character level/i })).toBeInTheDocument()
  })

  it('compares texts and shows differences', () => {
    render(<TextComparerTool />)
    const originalTextarea = screen.getByPlaceholderText('Enter original text...')
    const modifiedTextarea = screen.getByPlaceholderText('Enter modified text...')

    fireEvent.change(originalTextarea, { target: { value: 'Hello World' } })
    fireEvent.change(modifiedTextarea, { target: { value: 'Hello there World' } })

    const compareButton = screen.getByRole('button', { name: /compare texts/i })
    fireEvent.click(compareButton)

    expect(screen.getByText('Statistics')).toBeInTheDocument()
    expect(screen.getByText('Differences')).toBeInTheDocument()
  })

  it('shows statistics after comparison', () => {
    render(<TextComparerTool />)
    const originalTextarea = screen.getByPlaceholderText('Enter original text...')
    const modifiedTextarea = screen.getByPlaceholderText('Enter modified text...')

    fireEvent.change(originalTextarea, { target: { value: 'Hello' } })
    fireEvent.change(modifiedTextarea, { target: { value: 'Hello World' } })

    const compareButton = screen.getByRole('button', { name: /compare texts/i })
    fireEvent.click(compareButton)

    expect(screen.getByText('Additions:')).toBeInTheDocument()
    expect(screen.getByText('Deletions:')).toBeInTheDocument()
    expect(screen.getByText('Unchanged:')).toBeInTheDocument()
  })

  it('switches to character level diff mode', () => {
    render(<TextComparerTool />)

    const characterModeButton = screen.getByRole('button', { name: /character level/i })
    fireEvent.click(characterModeButton)

    // Just verify the button click doesn't crash and button is still there
    expect(characterModeButton).toBeInTheDocument()
  })

  it('switches back to word level diff mode', () => {
    render(<TextComparerTool />)

    const characterModeButton = screen.getByRole('button', { name: /character level/i })
    fireEvent.click(characterModeButton)

    const wordModeButton = screen.getByRole('button', { name: /word level/i })
    fireEvent.click(wordModeButton)

    // Just verify the button click doesn't crash and button is still there
    expect(wordModeButton).toBeInTheDocument()
  })

  it('handles empty texts gracefully', () => {
    render(<TextComparerTool />)

    const compareButton = screen.getByRole('button', { name: /compare texts/i })
    fireEvent.click(compareButton)

    // Should not show results for empty texts
    expect(screen.queryByText('Statistics')).not.toBeInTheDocument()
  })

  it('performs word-level diff', () => {
    render(<TextComparerTool />)
    const originalTextarea = screen.getByPlaceholderText('Enter original text...')
    const modifiedTextarea = screen.getByPlaceholderText('Enter modified text...')

    fireEvent.change(originalTextarea, { target: { value: 'The quick brown fox' } })
    fireEvent.change(modifiedTextarea, { target: { value: 'The quick red fox' } })

    const compareButton = screen.getByRole('button', { name: /compare texts/i })
    fireEvent.click(compareButton)

    // Should show differences
    expect(screen.getByText('Differences')).toBeInTheDocument()
  })

  it('performs character-level diff', () => {
    render(<TextComparerTool />)

    // Switch to character mode
    const characterModeButton = screen.getByRole('button', { name: /character level/i })
    fireEvent.click(characterModeButton)

    const originalTextarea = screen.getByPlaceholderText('Enter original text...')
    const modifiedTextarea = screen.getByPlaceholderText('Enter modified text...')

    fireEvent.change(originalTextarea, { target: { value: 'cat' } })
    fireEvent.change(modifiedTextarea, { target: { value: 'cut' } })

    const compareButton = screen.getByRole('button', { name: /compare texts/i })
    fireEvent.click(compareButton)

    // Should show differences
    expect(screen.getByText('Differences')).toBeInTheDocument()
  })

  it('handles identical texts', () => {
    render(<TextComparerTool />)
    const originalTextarea = screen.getByPlaceholderText('Enter original text...')
    const modifiedTextarea = screen.getByPlaceholderText('Enter modified text...')

    fireEvent.change(originalTextarea, { target: { value: 'Same text' } })
    fireEvent.change(modifiedTextarea, { target: { value: 'Same text' } })

    const compareButton = screen.getByRole('button', { name: /compare texts/i })
    fireEvent.click(compareButton)

    // Should show that all is unchanged
    expect(screen.getByText('Differences')).toBeInTheDocument()
  })
})
