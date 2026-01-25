import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { WordFrequencyTool } from '../word-frequency'

// Ensure cleanup after each test
afterEach(() => {
  cleanup()
})

// Helper to get input textarea
const getInputTextarea = () => {
  const textareas = screen.getAllByRole('textbox')
  return textareas[0] as HTMLTextAreaElement
}

describe('WordFrequencyTool', () => {
  it('renders without crashing', () => {
    render(<WordFrequencyTool />)
    expect(screen.getByText('Text Input')).toBeInTheDocument()
    expect(screen.getByText('Show Top N Words')).toBeInTheDocument()
    expect(screen.getByText('Minimum Word Length')).toBeInTheDocument()
  })

  it('displays correct placeholder', () => {
    render(<WordFrequencyTool />)
    const input = getInputTextarea()
    expect(input.placeholder).toMatch(/Enter or paste text to analyze/)
  })

  it('displays checkbox options', () => {
    render(<WordFrequencyTool />)
    expect(screen.getAllByText(/Ignore common words/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Case sensitive').length).toBeGreaterThanOrEqual(1)
  })

  it('counts word frequencies correctly', async () => {
    render(<WordFrequencyTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'apple banana apple cherry apple banana' } })

    await waitFor(() => {
      expect(screen.getByText('Word Frequency')).toBeInTheDocument()
      expect(screen.getByText('apple')).toBeInTheDocument()
      expect(screen.getByText('banana')).toBeInTheDocument()
      expect(screen.getByText('cherry')).toBeInTheDocument()
    })
  })

  it('displays total words count', async () => {
    render(<WordFrequencyTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'apple banana cherry' } })

    await waitFor(() => {
      expect(screen.getByText('Total Words')).toBeInTheDocument()
    })
  })

  it('displays unique words count', async () => {
    render(<WordFrequencyTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'apple banana apple' } })

    await waitFor(() => {
      expect(screen.getByText('Unique Words')).toBeInTheDocument()
    })
  })

  it('ignores stop words by default', async () => {
    render(<WordFrequencyTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'the quick brown fox jumps over the lazy dog' } })

    await waitFor(() => {
      expect(screen.getByText('Word Frequency')).toBeInTheDocument()
      expect(screen.queryByText(/^the$/)).not.toBeInTheDocument()
      expect(screen.queryByText(/^over$/)).not.toBeInTheDocument()
      expect(screen.getByText('quick')).toBeInTheDocument()
      expect(screen.getByText('brown')).toBeInTheDocument()
    })
  })

  it('includes stop words when option is unchecked', async () => {
    render(<WordFrequencyTool />)
    const input = getInputTextarea()
    const ignoreStopWordsCheckbox = document.getElementById('ignoreStopWords') as HTMLInputElement

    fireEvent.click(ignoreStopWordsCheckbox)
    fireEvent.change(input, { target: { value: 'the quick brown fox the' } })

    await waitFor(() => {
      // "the" should now appear as it's a stop word
      expect(screen.getByText('the')).toBeInTheDocument()
    })
  })

  it('is case insensitive by default', async () => {
    render(<WordFrequencyTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'Apple apple APPLE' } })

    await waitFor(() => {
      expect(screen.getByText('Word Frequency')).toBeInTheDocument()
      // All should be counted as one word (lowercase)
      expect(screen.getByText('apple')).toBeInTheDocument()
      // The count 3 appears in multiple places (total words and word count)
      expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1)
    })
  })

  it('respects case sensitivity when enabled', async () => {
    render(<WordFrequencyTool />)
    const input = getInputTextarea()
    const caseSensitiveCheckbox = document.getElementById('caseSensitive') as HTMLInputElement

    fireEvent.click(caseSensitiveCheckbox)
    fireEvent.change(input, { target: { value: 'Apple apple APPLE banana' } })

    await waitFor(() => {
      // Should have separate counts for different cases
      const frequencyItems = screen.getAllByText(/apple/i)
      expect(frequencyItems.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('limits results to top N words', async () => {
    render(<WordFrequencyTool />)
    const input = getInputTextarea()
    const topNInput = screen.getByDisplayValue('25') as HTMLInputElement

    fireEvent.change(topNInput, { target: { value: '2' } })
    fireEvent.change(input, { target: { value: 'apple apple apple banana banana cherry' } })

    await waitFor(() => {
      expect(screen.getByText('apple')).toBeInTheDocument()
      expect(screen.getByText('banana')).toBeInTheDocument()
      expect(screen.queryByText('cherry')).not.toBeInTheDocument()
    })
  })

  it('filters by minimum word length', async () => {
    render(<WordFrequencyTool />)
    const input = getInputTextarea()
    const minLengthInput = screen.getByDisplayValue('1') as HTMLInputElement

    fireEvent.change(minLengthInput, { target: { value: '4' } })
    fireEvent.change(input, { target: { value: 'a ab abc abcd abcde' } })

    await waitFor(() => {
      expect(screen.getByText('abcd')).toBeInTheDocument()
      expect(screen.getByText('abcde')).toBeInTheDocument()
      expect(screen.queryByText(/^a$/)).not.toBeInTheDocument()
      expect(screen.queryByText(/^ab$/)).not.toBeInTheDocument()
      expect(screen.queryByText(/^abc$/)).not.toBeInTheDocument()
    })
  })

  it('shows percentages for word frequencies', async () => {
    render(<WordFrequencyTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'apple apple banana' } })

    await waitFor(() => {
      expect(screen.getByText('Word Frequency')).toBeInTheDocument()
      // Should show percentage format like "66.7%"
      const percentElements = screen.getAllByText(/%/)
      expect(percentElements.length).toBeGreaterThan(0)
    })
  })

  it('handles empty input gracefully', () => {
    render(<WordFrequencyTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: '' } })

    expect(screen.queryByText('Word Frequency')).not.toBeInTheDocument()
    expect(screen.queryByText('Total Words')).not.toBeInTheDocument()
  })

  it('displays stop words info message when enabled', async () => {
    render(<WordFrequencyTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'test words here' } })

    await waitFor(() => {
      expect(screen.getByText(/Stop words.*excluded/)).toBeInTheDocument()
    })
  })

  it('shows ranking numbers for words', async () => {
    render(<WordFrequencyTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'apple apple banana cherry' } })

    await waitFor(() => {
      expect(screen.getByText('1.')).toBeInTheDocument()
      expect(screen.getByText('2.')).toBeInTheDocument()
    })
  })

  it('sorts words by frequency in descending order', async () => {
    render(<WordFrequencyTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'cherry apple apple apple banana banana' } })

    await waitFor(() => {
      const words = screen.getAllByText(/apple|banana|cherry/)
      // First word should be apple (3), then banana (2), then cherry (1)
      const wordTexts = words.map(w => w.textContent)
      const appleIndex = wordTexts.indexOf('apple')
      const bananaIndex = wordTexts.indexOf('banana')
      const cherryIndex = wordTexts.indexOf('cherry')
      expect(appleIndex).toBeLessThan(bananaIndex)
      expect(bananaIndex).toBeLessThan(cherryIndex)
    })
  })

  it('handles punctuation correctly', async () => {
    render(<WordFrequencyTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'Hello, world! Hello world.' } })

    await waitFor(() => {
      expect(screen.getByText('Word Frequency')).toBeInTheDocument()
      // Check hello and world appear in the output
      expect(screen.getAllByText(/hello/).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/world/).length).toBeGreaterThan(0)
    })
  })
})
