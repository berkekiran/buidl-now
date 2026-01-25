import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { JsFormatterTool } from '../js-formatter'

describe('JsFormatterTool', () => {
  it('renders without crashing', () => {
    render(<JsFormatterTool />)
    expect(screen.getByText('JavaScript / TypeScript Input')).toBeInTheDocument()
    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    expect(formatButtons.length).toBeGreaterThanOrEqual(2)
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('starts in format mode', () => {
    render(<JsFormatterTool />)
    expect(screen.getByPlaceholderText(/const greeting/)).toBeInTheDocument()
  })

  it('formats minified JavaScript', () => {
    render(<JsFormatterTool />)
    const textarea = screen.getByPlaceholderText(/const greeting/)

    fireEvent.change(textarea, {
      target: { value: 'function greet(name){return "Hello, "+name}' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted Code')).toBeInTheDocument()
  })

  it('shows formatted output with indentation', () => {
    render(<JsFormatterTool />)
    const textarea = screen.getByPlaceholderText(/const greeting/)

    fireEvent.change(textarea, {
      target: { value: 'function greet(){console.log("hi")}' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toContain('\n')
  })

  it('switches to minify mode', () => {
    render(<JsFormatterTool />)

    const minifyButton = screen.getByRole('button', { name: 'Minify' })
    fireEvent.click(minifyButton)

    expect(screen.getByPlaceholderText(/Enter code to minify/)).toBeInTheDocument()
  })

  it('minifies formatted JavaScript', () => {
    render(<JsFormatterTool />)

    // Switch to minify mode
    const minifyModeButton = screen.getByRole('button', { name: 'Minify' })
    fireEvent.click(minifyModeButton)

    const textarea = screen.getByPlaceholderText(/Enter code to minify/)

    fireEvent.change(textarea, {
      target: { value: 'function greet(name) {\n  return "Hello, " + name;\n}' }
    })

    // Click the action button (Minify Code)
    const minifyCodeButton = screen.getByRole('button', { name: 'Minify Code' })
    fireEvent.click(minifyCodeButton)

    expect(screen.getByText('Minified Code')).toBeInTheDocument()
    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    // Minified code should have no newlines
    expect(outputTextarea?.value).not.toContain('\n')
  })

  it('removes single-line comments when minifying', () => {
    render(<JsFormatterTool />)

    // Switch to minify mode
    const minifyModeButton = screen.getByRole('button', { name: 'Minify' })
    fireEvent.click(minifyModeButton)

    const textarea = screen.getByPlaceholderText(/Enter code to minify/)

    fireEvent.change(textarea, {
      target: { value: '// comment\nconst x = 1;' }
    })

    const minifyCodeButton = screen.getByRole('button', { name: 'Minify Code' })
    fireEvent.click(minifyCodeButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).not.toContain('// comment')
  })

  it('removes multi-line comments when minifying', () => {
    render(<JsFormatterTool />)

    // Switch to minify mode
    const minifyModeButton = screen.getByRole('button', { name: 'Minify' })
    fireEvent.click(minifyModeButton)

    const textarea = screen.getByPlaceholderText(/Enter code to minify/)

    fireEvent.change(textarea, {
      target: { value: '/* multi\nline */\nconst x = 1;' }
    })

    const minifyCodeButton = screen.getByRole('button', { name: 'Minify Code' })
    fireEvent.click(minifyCodeButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).not.toContain('/*')
    expect(outputTextarea?.value).not.toContain('*/')
  })

  it('handles objects in formatting', () => {
    render(<JsFormatterTool />)
    const textarea = screen.getByPlaceholderText(/const greeting/)

    fireEvent.change(textarea, {
      target: { value: 'const obj={name:"John",age:30}' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted Code')).toBeInTheDocument()
  })

  it('handles arrow functions', () => {
    render(<JsFormatterTool />)
    const textarea = screen.getByPlaceholderText(/const greeting/)

    fireEvent.change(textarea, {
      target: { value: 'const greet=()=>{console.log("hi")}' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted Code')).toBeInTheDocument()
  })

  it('resets all fields when reset button is clicked', () => {
    render(<JsFormatterTool />)
    const textarea = screen.getByPlaceholderText(/const greeting/) as HTMLTextAreaElement

    fireEvent.change(textarea, {
      target: { value: 'const x = 1;' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted Code')).toBeInTheDocument()

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(textarea.value).toBe('')
    expect(screen.queryByText('Formatted Code')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<JsFormatterTool />)
    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    // Should not show output for empty input
    expect(screen.queryByText('Formatted Code')).not.toBeInTheDocument()
  })

  it('clears output when switching modes', () => {
    render(<JsFormatterTool />)
    const textarea = screen.getByPlaceholderText(/const greeting/)

    fireEvent.change(textarea, {
      target: { value: 'const x = 1;' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted Code')).toBeInTheDocument()

    // Switch to minify mode
    const minifyButton = screen.getByRole('button', { name: 'Minify' })
    fireEvent.click(minifyButton)

    // Output should be cleared
    expect(screen.queryByText('Formatted Code')).not.toBeInTheDocument()
  })

  it('handles class definitions', () => {
    render(<JsFormatterTool />)
    const textarea = screen.getByPlaceholderText(/const greeting/)

    fireEvent.change(textarea, {
      target: { value: 'class Person{constructor(name){this.name=name}}' }
    })

    const formatButtons = screen.getAllByRole('button', { name: /Format/i })
    fireEvent.click(formatButtons[formatButtons.length - 1])

    expect(screen.getByText('Formatted Code')).toBeInTheDocument()
  })

  it('preserves keywords when minifying', () => {
    render(<JsFormatterTool />)

    // Switch to minify mode
    const minifyModeButton = screen.getByRole('button', { name: 'Minify' })
    fireEvent.click(minifyModeButton)

    const textarea = screen.getByPlaceholderText(/Enter code to minify/)

    fireEvent.change(textarea, {
      target: { value: 'function test() { return true; }' }
    })

    const minifyCodeButton = screen.getByRole('button', { name: 'Minify Code' })
    fireEvent.click(minifyCodeButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toContain('function')
    expect(outputTextarea?.value).toContain('return')
  })
})
