import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CssFormatterTool } from '../css-formatter'

describe('CssFormatterTool', () => {
  it('renders without crashing', () => {
    render(<CssFormatterTool />)
    expect(screen.getByText('CSS Input')).toBeInTheDocument()
    // Mode buttons and action button
    const formatButtons = screen.getAllByRole('button', { name: /format/i })
    expect(formatButtons.length).toBeGreaterThanOrEqual(2)
  })

  it('starts in format mode', () => {
    render(<CssFormatterTool />)
    expect(screen.getByPlaceholderText('Enter CSS to format...')).toBeInTheDocument()
  })

  it('formats minified CSS', () => {
    render(<CssFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter CSS to format...')

    fireEvent.change(textarea, {
      target: { value: 'body{margin:0;padding:0}' }
    })

    // Click the action Format button (the one in the button group, not the mode button)
    // In format mode: mode button "Format" + action button "Format"
    const formatButtons = screen.getAllByRole('button', { name: /format/i })
    // The action button is the last one (index 1 since there are 2 format buttons)
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted CSS')).toBeInTheDocument()
  })

  it('switches to minify mode', () => {
    render(<CssFormatterTool />)

    // Click the Minify mode button
    const minifyButtons = screen.getAllByRole('button', { name: /minify/i })
    fireEvent.click(minifyButtons[0]) // First one is the mode button

    expect(screen.getByPlaceholderText('Enter CSS to minify...')).toBeInTheDocument()
  })

  it('minifies formatted CSS', () => {
    render(<CssFormatterTool />)

    // Switch to minify mode
    const minifyModeButton = screen.getAllByRole('button', { name: /minify/i })[0]
    fireEvent.click(minifyModeButton)

    const textarea = screen.getByPlaceholderText('Enter CSS to minify...')

    fireEvent.change(textarea, {
      target: { value: 'body {\n  margin: 0;\n  padding: 0;\n}' }
    })

    // Click the Minify action button (now there are 2 minify buttons)
    const minifyButtons = screen.getAllByRole('button', { name: /minify/i })
    fireEvent.click(minifyButtons[minifyButtons.length - 1])

    expect(screen.getByText('Minified CSS')).toBeInTheDocument()
  })

  it('removes comments when formatting', () => {
    render(<CssFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter CSS to format...')

    fireEvent.change(textarea, {
      target: { value: '/* comment */ body{margin:0}' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    // Output should be visible and not contain the comment
    expect(screen.getByText('Formatted CSS')).toBeInTheDocument()
    // Get all textareas, the output is the one that's readonly
    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).not.toContain('/* comment */')
  })

  it('removes comments when minifying', () => {
    render(<CssFormatterTool />)

    // Switch to minify mode
    const minifyModeButton = screen.getAllByRole('button', { name: /minify/i })[0]
    fireEvent.click(minifyModeButton)

    const textarea = screen.getByPlaceholderText('Enter CSS to minify...')

    fireEvent.change(textarea, {
      target: { value: '/* comment */ body { margin: 0; }' }
    })

    const minifyButtons = screen.getAllByRole('button', { name: /minify/i })
    fireEvent.click(minifyButtons[minifyButtons.length - 1])

    // Output should be visible and not contain the comment
    expect(screen.getByText('Minified CSS')).toBeInTheDocument()
    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).not.toContain('/* comment */')
  })

  it('handles multiple selectors', () => {
    render(<CssFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter CSS to format...')

    fireEvent.change(textarea, {
      target: { value: 'body{margin:0}.header{color:blue}' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted CSS')).toBeInTheDocument()
  })

  it('resets input and output', () => {
    render(<CssFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter CSS to format...') as HTMLTextAreaElement

    fireEvent.change(textarea, {
      target: { value: 'body{margin:0}' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted CSS')).toBeInTheDocument()

    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)

    expect(textarea.value).toBe('')
    expect(screen.queryByText('Formatted CSS')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<CssFormatterTool />)

    const formatButtons = screen.getAllByRole('button', { name: /format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    // Should not show output for empty input
    expect(screen.queryByText('Formatted CSS')).not.toBeInTheDocument()
  })

  it('clears output when switching modes', () => {
    render(<CssFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter CSS to format...')

    fireEvent.change(textarea, {
      target: { value: 'body{margin:0}' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted CSS')).toBeInTheDocument()

    // Switch to minify mode
    const minifyModeButton = screen.getAllByRole('button', { name: /minify/i })[0]
    fireEvent.click(minifyModeButton)

    // Output should be cleared
    expect(screen.queryByText('Formatted CSS')).not.toBeInTheDocument()
  })

  it('handles CSS properties correctly', () => {
    render(<CssFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter CSS to format...')

    fireEvent.change(textarea, {
      target: { value: '.class{color:red;background:blue;font-size:16px}' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted CSS')).toBeInTheDocument()
  })
})
