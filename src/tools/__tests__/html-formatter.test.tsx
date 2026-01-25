import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HtmlFormatterTool } from '../html-formatter'

describe('HtmlFormatterTool', () => {
  it('renders without crashing', () => {
    render(<HtmlFormatterTool />)
    expect(screen.getByText('HTML Input')).toBeInTheDocument()
    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    expect(formatButtons.length).toBeGreaterThanOrEqual(2)
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('starts in format mode', () => {
    render(<HtmlFormatterTool />)
    expect(screen.getByPlaceholderText('<div><p>Hello World</p></div>')).toBeInTheDocument()
  })

  it('formats minified HTML', () => {
    render(<HtmlFormatterTool />)
    const textarea = screen.getByPlaceholderText('<div><p>Hello World</p></div>')

    fireEvent.change(textarea, {
      target: { value: '<div><p>Hello</p></div>' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted HTML')).toBeInTheDocument()
  })

  it('shows formatted output with indentation', () => {
    render(<HtmlFormatterTool />)
    const textarea = screen.getByPlaceholderText('<div><p>Hello World</p></div>')

    fireEvent.change(textarea, {
      target: { value: '<html><head><title>Test</title></head><body><p>Content</p></body></html>' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toContain('\n')
    expect(outputTextarea?.value).toContain('  ')
  })

  it('switches to minify mode', () => {
    render(<HtmlFormatterTool />)

    const minifyButton = screen.getByRole('button', { name: 'Minify' })
    fireEvent.click(minifyButton)

    expect(screen.getByPlaceholderText('Enter HTML to minify...')).toBeInTheDocument()
  })

  it('minifies formatted HTML', () => {
    render(<HtmlFormatterTool />)

    // Switch to minify mode
    const minifyModeButton = screen.getByRole('button', { name: 'Minify' })
    fireEvent.click(minifyModeButton)

    const textarea = screen.getByPlaceholderText('Enter HTML to minify...')

    fireEvent.change(textarea, {
      target: { value: '<div>\n  <p>Hello</p>\n</div>' }
    })

    const minifyHtmlButton = screen.getByRole('button', { name: 'Minify HTML' })
    fireEvent.click(minifyHtmlButton)

    expect(screen.getByText('Minified HTML')).toBeInTheDocument()
    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    // Minified HTML should have no newlines
    expect(outputTextarea?.value).not.toContain('\n')
  })

  it('removes HTML comments when minifying', () => {
    render(<HtmlFormatterTool />)

    // Switch to minify mode
    const minifyModeButton = screen.getByRole('button', { name: 'Minify' })
    fireEvent.click(minifyModeButton)

    const textarea = screen.getByPlaceholderText('Enter HTML to minify...')

    fireEvent.change(textarea, {
      target: { value: '<!-- comment --><div>Hello</div>' }
    })

    const minifyHtmlButton = screen.getByRole('button', { name: 'Minify HTML' })
    fireEvent.click(minifyHtmlButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).not.toContain('<!-- comment -->')
  })

  it('handles void elements correctly', () => {
    render(<HtmlFormatterTool />)
    const textarea = screen.getByPlaceholderText('<div><p>Hello World</p></div>')

    fireEvent.change(textarea, {
      target: { value: '<div><img src="test.jpg"><br><input type="text"></div>' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted HTML')).toBeInTheDocument()
  })

  it('handles self-closing tags', () => {
    render(<HtmlFormatterTool />)
    const textarea = screen.getByPlaceholderText('<div><p>Hello World</p></div>')

    fireEvent.change(textarea, {
      target: { value: '<div><img src="test.jpg" /></div>' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted HTML')).toBeInTheDocument()
  })

  it('handles nested elements', () => {
    render(<HtmlFormatterTool />)
    const textarea = screen.getByPlaceholderText('<div><p>Hello World</p></div>')

    fireEvent.change(textarea, {
      target: { value: '<div><section><article><p>Deep nesting</p></article></section></div>' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    // Should have multiple indentation levels
    expect(outputTextarea?.value.split('\n').length).toBeGreaterThan(1)
  })

  it('handles attributes in tags', () => {
    render(<HtmlFormatterTool />)
    const textarea = screen.getByPlaceholderText('<div><p>Hello World</p></div>')

    fireEvent.change(textarea, {
      target: { value: '<div class="container" id="main"><a href="https://example.com">Link</a></div>' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted HTML')).toBeInTheDocument()
    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toContain('class="container"')
  })

  it('resets all fields when reset button is clicked', () => {
    render(<HtmlFormatterTool />)
    const textarea = screen.getByPlaceholderText('<div><p>Hello World</p></div>') as HTMLTextAreaElement

    fireEvent.change(textarea, {
      target: { value: '<div><p>Test</p></div>' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted HTML')).toBeInTheDocument()

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(textarea.value).toBe('')
    expect(screen.queryByText('Formatted HTML')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<HtmlFormatterTool />)
    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    // Should not show output for empty input
    expect(screen.queryByText('Formatted HTML')).not.toBeInTheDocument()
  })

  it('clears output when switching modes', () => {
    render(<HtmlFormatterTool />)
    const textarea = screen.getByPlaceholderText('<div><p>Hello World</p></div>')

    fireEvent.change(textarea, {
      target: { value: '<div><p>Test</p></div>' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted HTML')).toBeInTheDocument()

    // Switch to minify mode
    const minifyButton = screen.getByRole('button', { name: 'Minify' })
    fireEvent.click(minifyButton)

    // Output should be cleared
    expect(screen.queryByText('Formatted HTML')).not.toBeInTheDocument()
  })

  it('handles DOCTYPE declaration', () => {
    render(<HtmlFormatterTool />)
    const textarea = screen.getByPlaceholderText('<div><p>Hello World</p></div>')

    fireEvent.change(textarea, {
      target: { value: '<!DOCTYPE html><html><head></head><body></body></html>' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted HTML')).toBeInTheDocument()
  })

  it('collapses whitespace between tags when minifying', () => {
    render(<HtmlFormatterTool />)

    // Switch to minify mode
    const minifyModeButton = screen.getByRole('button', { name: 'Minify' })
    fireEvent.click(minifyModeButton)

    const textarea = screen.getByPlaceholderText('Enter HTML to minify...')

    fireEvent.change(textarea, {
      target: { value: '<div>   <p>   Hello   </p>   </div>' }
    })

    const minifyHtmlButton = screen.getByRole('button', { name: 'Minify HTML' })
    fireEvent.click(minifyHtmlButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    // Multiple spaces should be collapsed
    expect(outputTextarea?.value).toBe('<div><p> Hello </p></div>')
  })
})
