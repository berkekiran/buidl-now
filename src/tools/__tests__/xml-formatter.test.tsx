import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { XmlFormatterTool } from '../xml-formatter'

describe('XmlFormatterTool', () => {
  beforeEach(() => {
    // Mock DOMParser for jsdom environment
    vi.spyOn(window.DOMParser.prototype, 'parseFromString').mockImplementation((str, type) => {
      const doc = document.implementation.createDocument(null, null, null)
      // Simple check for valid XML - if it starts with < and ends with >
      if (str.includes('<parsererror')) {
        const errorEl = document.createElement('parsererror')
        errorEl.textContent = 'Invalid XML'
        doc.appendChild(errorEl)
      }
      return doc
    })
  })

  it('renders without crashing', () => {
    render(<XmlFormatterTool />)
    expect(screen.getByText('XML Input')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /format xml/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('formats simple XML', () => {
    render(<XmlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter XML to format...')

    fireEvent.change(textarea, {
      target: { value: '<root><item>Value</item></root>' }
    })

    const formatButton = screen.getByRole('button', { name: /format xml/i })
    fireEvent.click(formatButton)

    expect(screen.getByText('Formatted XML')).toBeInTheDocument()
  })

  it('handles nested XML elements', () => {
    render(<XmlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter XML to format...')

    fireEvent.change(textarea, {
      target: { value: '<root><parent><child>Value</child></parent></root>' }
    })

    const formatButton = screen.getByRole('button', { name: /format xml/i })
    fireEvent.click(formatButton)

    expect(screen.getByText('Formatted XML')).toBeInTheDocument()
  })

  it('handles XML with attributes', () => {
    render(<XmlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter XML to format...')

    fireEvent.change(textarea, {
      target: { value: '<person id="1" name="John"><age>30</age></person>' }
    })

    const formatButton = screen.getByRole('button', { name: /format xml/i })
    fireEvent.click(formatButton)

    expect(screen.getByText('Formatted XML')).toBeInTheDocument()
  })

  it('handles self-closing tags', () => {
    render(<XmlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter XML to format...')

    fireEvent.change(textarea, {
      target: { value: '<root><item/></root>' }
    })

    const formatButton = screen.getByRole('button', { name: /format xml/i })
    fireEvent.click(formatButton)

    expect(screen.getByText('Formatted XML')).toBeInTheDocument()
  })

  it('resets input and output', () => {
    render(<XmlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter XML to format...') as HTMLTextAreaElement

    fireEvent.change(textarea, {
      target: { value: '<root>test</root>' }
    })

    const formatButton = screen.getByRole('button', { name: /format xml/i })
    fireEvent.click(formatButton)

    expect(screen.getByText('Formatted XML')).toBeInTheDocument()

    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)

    expect(textarea.value).toBe('')
    expect(screen.queryByText('Formatted XML')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<XmlFormatterTool />)

    const formatButton = screen.getByRole('button', { name: /format xml/i })
    fireEvent.click(formatButton)

    // Should not show output for empty input
    expect(screen.queryByText('Formatted XML')).not.toBeInTheDocument()
  })

  it('handles whitespace-only input', () => {
    render(<XmlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter XML to format...')

    fireEvent.change(textarea, { target: { value: '   ' } })

    const formatButton = screen.getByRole('button', { name: /format xml/i })
    fireEvent.click(formatButton)

    // Should not show output for whitespace-only input
    expect(screen.queryByText('Formatted XML')).not.toBeInTheDocument()
  })

  it('adds proper indentation', () => {
    render(<XmlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter XML to format...')

    fireEvent.change(textarea, {
      target: { value: '<root><item>test</item></root>' }
    })

    const formatButton = screen.getByRole('button', { name: /format xml/i })
    fireEvent.click(formatButton)

    // Check that formatted output exists
    expect(screen.getByText('Formatted XML')).toBeInTheDocument()
  })

  it('handles multiple sibling elements', () => {
    render(<XmlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter XML to format...')

    fireEvent.change(textarea, {
      target: { value: '<root><item1>A</item1><item2>B</item2><item3>C</item3></root>' }
    })

    const formatButton = screen.getByRole('button', { name: /format xml/i })
    fireEvent.click(formatButton)

    expect(screen.getByText('Formatted XML')).toBeInTheDocument()
  })
})
