import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { MarkdownHtmlTool } from '../markdown-html'

// Ensure cleanup after each test
afterEach(() => {
  cleanup()
})

// Helper to get textareas
const getTextareas = () => {
  const textareas = screen.getAllByRole('textbox')
  return {
    markdownInput: textareas[0] as HTMLTextAreaElement,
    htmlInput: textareas[1] as HTMLTextAreaElement
  }
}

describe('MarkdownHtmlTool', () => {
  it('renders without crashing', () => {
    render(<MarkdownHtmlTool />)
    expect(screen.getByText('Markdown')).toBeInTheDocument()
    expect(screen.getByText('HTML')).toBeInTheDocument()
    expect(screen.getByTitle('Swap')).toBeInTheDocument()
  })

  it('displays correct placeholders', () => {
    render(<MarkdownHtmlTool />)
    const { markdownInput, htmlInput } = getTextareas()
    expect(markdownInput.placeholder).toMatch(/# Hello World/)
    expect(htmlInput.placeholder).toMatch(/<h1>Hello World<\/h1>/)
  })

  it('converts markdown to HTML when markdown input changes', async () => {
    render(<MarkdownHtmlTool />)
    const { markdownInput, htmlInput } = getTextareas()

    fireEvent.change(markdownInput, { target: { value: '# Test Heading' } })

    await waitFor(() => {
      expect(htmlInput.value).toContain('<h1>Test Heading</h1>')
    })
  })

  it('converts bold markdown to HTML', async () => {
    render(<MarkdownHtmlTool />)
    const { markdownInput, htmlInput } = getTextareas()

    fireEvent.change(markdownInput, { target: { value: '**bold text**' } })

    await waitFor(() => {
      expect(htmlInput.value).toContain('<strong>bold text</strong>')
    })
  })

  it('converts italic markdown to HTML', async () => {
    render(<MarkdownHtmlTool />)
    const { markdownInput, htmlInput } = getTextareas()

    fireEvent.change(markdownInput, { target: { value: '*italic text*' } })

    await waitFor(() => {
      expect(htmlInput.value).toContain('<em>italic text</em>')
    })
  })

  it('converts HTML to markdown when HTML input changes', async () => {
    render(<MarkdownHtmlTool />)
    const { markdownInput, htmlInput } = getTextareas()

    fireEvent.change(htmlInput, { target: { value: '<h1>Test Heading</h1>' } })

    await waitFor(() => {
      expect(markdownInput.value).toContain('# Test Heading')
    })
  })

  it('converts HTML bold to markdown', async () => {
    render(<MarkdownHtmlTool />)
    const { markdownInput, htmlInput } = getTextareas()

    fireEvent.change(htmlInput, { target: { value: '<p><strong>bold text</strong></p>' } })

    await waitFor(() => {
      expect(markdownInput.value).toContain('**bold text**')
    })
  })

  it('converts HTML italic to markdown', async () => {
    render(<MarkdownHtmlTool />)
    const { markdownInput, htmlInput } = getTextareas()

    fireEvent.change(htmlInput, { target: { value: '<p><em>italic text</em></p>' } })

    await waitFor(() => {
      expect(markdownInput.value).toContain('*italic text*')
    })
  })

  it('swaps values when swap button is clicked', async () => {
    render(<MarkdownHtmlTool />)
    const { markdownInput, htmlInput } = getTextareas()

    fireEvent.change(markdownInput, { target: { value: '# Heading' } })

    await waitFor(() => {
      expect(htmlInput.value).toContain('<h1>Heading</h1>')
    })

    const swapButton = screen.getByTitle('Swap')
    fireEvent.click(swapButton)

    // After swap, markdown should have the HTML content
    await waitFor(() => {
      expect(markdownInput.value).toContain('<h1>Heading</h1>')
    })
  })

  it('handles empty input gracefully', () => {
    render(<MarkdownHtmlTool />)
    const { markdownInput } = getTextareas()

    fireEvent.change(markdownInput, { target: { value: '' } })

    // Should not crash and no error should be displayed
    expect(screen.queryByText(/Invalid/)).not.toBeInTheDocument()
  })

  it('converts links markdown to HTML', async () => {
    render(<MarkdownHtmlTool />)
    const { markdownInput, htmlInput } = getTextareas()

    fireEvent.change(markdownInput, { target: { value: '[Google](https://google.com)' } })

    await waitFor(() => {
      expect(htmlInput.value).toContain('href="https://google.com"')
      expect(htmlInput.value).toContain('Google')
    })
  })

  it('converts HTML links to markdown', async () => {
    render(<MarkdownHtmlTool />)
    const { markdownInput, htmlInput } = getTextareas()

    fireEvent.change(htmlInput, { target: { value: '<a href="https://example.com">Example</a>' } })

    await waitFor(() => {
      expect(markdownInput.value).toContain('[Example](https://example.com)')
    })
  })

  it('converts lists in markdown to HTML', async () => {
    render(<MarkdownHtmlTool />)
    const { markdownInput, htmlInput } = getTextareas()

    fireEvent.change(markdownInput, { target: { value: '- Item 1\n- Item 2' } })

    await waitFor(() => {
      expect(htmlInput.value).toContain('<li>Item 1</li>')
      expect(htmlInput.value).toContain('<li>Item 2</li>')
    })
  })
})
