import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TextAnalyzerTool } from '../text-analyzer'

describe('TextAnalyzerTool', () => {
  it('renders without crashing', () => {
    render(<TextAnalyzerTool />)
    expect(screen.getByText('Enter Text to Analyze')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/type or paste your text/i)).toBeInTheDocument()
  })

  it('does not show statistics initially', () => {
    render(<TextAnalyzerTool />)
    expect(screen.queryByText('Basic Counts')).not.toBeInTheDocument()
    expect(screen.queryByText('Word Statistics')).not.toBeInTheDocument()
  })

  it('shows character count after entering text', async () => {
    render(<TextAnalyzerTool />)

    const textarea = screen.getByPlaceholderText(/type or paste your text/i)
    fireEvent.change(textarea, { target: { value: 'Hello World' } })

    await waitFor(() => {
      expect(screen.getByText('Characters')).toBeInTheDocument()
      // 'Hello World' is 11 characters - check for the number being displayed
      expect(screen.getAllByText('11').length).toBeGreaterThan(0)
    })
  })

  it('calculates word count correctly', async () => {
    render(<TextAnalyzerTool />)

    const textarea = screen.getByPlaceholderText(/type or paste your text/i)
    fireEvent.change(textarea, { target: { value: 'one two three four five' } })

    await waitFor(() => {
      expect(screen.getByText('Total Words')).toBeInTheDocument()
      // 5 words - check for the number being displayed
      expect(screen.getAllByText('5').length).toBeGreaterThan(0)
    })
  })

  it('calculates unique words correctly', async () => {
    render(<TextAnalyzerTool />)

    const textarea = screen.getByPlaceholderText(/type or paste your text/i)
    fireEvent.change(textarea, { target: { value: 'apple apple banana cherry' } })

    await waitFor(() => {
      expect(screen.getByText('Unique Words')).toBeInTheDocument()
      // 3 unique words - check for the number being displayed
      expect(screen.getAllByText('3').length).toBeGreaterThan(0)
    })
  })

  it('counts lines correctly', async () => {
    render(<TextAnalyzerTool />)

    const textarea = screen.getByPlaceholderText(/type or paste your text/i)
    fireEvent.change(textarea, { target: { value: 'line one\nline two\nline three' } })

    await waitFor(() => {
      expect(screen.getByText('Lines')).toBeInTheDocument()
      // 3 lines - check for the number being displayed (may have multiple 3s)
      expect(screen.getAllByText('3').length).toBeGreaterThan(0)
    })
  })

  it('shows characters without spaces', async () => {
    render(<TextAnalyzerTool />)

    const textarea = screen.getByPlaceholderText(/type or paste your text/i)
    fireEvent.change(textarea, { target: { value: 'Hello World' } })

    await waitFor(() => {
      expect(screen.getByText('Characters (no spaces)')).toBeInTheDocument()
      // 'HelloWorld' without space = 10
      expect(screen.getAllByText('10').length).toBeGreaterThan(0)
    })
  })

  it('calculates reading time', async () => {
    render(<TextAnalyzerTool />)

    const textarea = screen.getByPlaceholderText(/type or paste your text/i)
    // 200 words = 1 minute reading time
    const words = Array(200).fill('word').join(' ')
    fireEvent.change(textarea, { target: { value: words } })

    await waitFor(() => {
      expect(screen.getByText('Reading Time')).toBeInTheDocument()
      expect(screen.getByText('1 minute')).toBeInTheDocument()
    })
  })

  it('shows character frequency distribution', async () => {
    render(<TextAnalyzerTool />)

    const textarea = screen.getByPlaceholderText(/type or paste your text/i)
    fireEvent.change(textarea, { target: { value: 'aaabbbccc' } })

    await waitFor(() => {
      expect(screen.getByText('Character Frequency Distribution')).toBeInTheDocument()
    })
  })

  it('resets statistics when input is cleared', async () => {
    render(<TextAnalyzerTool />)

    const textarea = screen.getByPlaceholderText(/type or paste your text/i)
    fireEvent.change(textarea, { target: { value: 'Some text' } })

    await waitFor(() => {
      expect(screen.getByText('Basic Counts')).toBeInTheDocument()
    })

    fireEvent.change(textarea, { target: { value: '' } })

    await waitFor(() => {
      expect(screen.queryByText('Basic Counts')).not.toBeInTheDocument()
    })
  })

  it('shows lexical density metric', async () => {
    render(<TextAnalyzerTool />)

    const textarea = screen.getByPlaceholderText(/type or paste your text/i)
    fireEvent.change(textarea, { target: { value: 'The quick brown fox jumps over the lazy dog' } })

    await waitFor(() => {
      expect(screen.getByText('Lexical Density')).toBeInTheDocument()
    })
  })
})
