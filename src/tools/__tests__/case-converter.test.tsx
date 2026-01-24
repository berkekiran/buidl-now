import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CaseConverterTool } from '../case-converter'

describe('CaseConverterTool', () => {
  it('renders without crashing', () => {
    render(<CaseConverterTool />)
    expect(screen.getByText('Input Text')).toBeInTheDocument()
    expect(screen.getByText('Conversions')).toBeInTheDocument()
  })

  it('shows all conversion format labels', () => {
    render(<CaseConverterTool />)
    expect(screen.getByText('UPPERCASE')).toBeInTheDocument()
    expect(screen.getByText('lowercase')).toBeInTheDocument()
    expect(screen.getByText('Title Case')).toBeInTheDocument()
    expect(screen.getByText('camelCase')).toBeInTheDocument()
    expect(screen.getByText('PascalCase')).toBeInTheDocument()
    expect(screen.getByText('snake_case')).toBeInTheDocument()
    expect(screen.getByText('kebab-case')).toBeInTheDocument()
    expect(screen.getByText('CONSTANT_CASE')).toBeInTheDocument()
  })

  it('converts text to UPPERCASE', () => {
    render(<CaseConverterTool />)
    const textarea = screen.getByPlaceholderText('Enter text to convert...')
    fireEvent.change(textarea, { target: { value: 'hello world' } })
    expect(screen.getByDisplayValue('HELLO WORLD')).toBeInTheDocument()
  })

  it('converts text to lowercase', () => {
    render(<CaseConverterTool />)
    const textarea = screen.getByPlaceholderText('Enter text to convert...')
    fireEvent.change(textarea, { target: { value: 'HELLO WORLD' } })
    expect(screen.getByDisplayValue('hello world')).toBeInTheDocument()
  })

  it('converts text to Title Case', () => {
    render(<CaseConverterTool />)
    const textarea = screen.getByPlaceholderText('Enter text to convert...')
    fireEvent.change(textarea, { target: { value: 'hello world' } })
    expect(screen.getByDisplayValue('Hello World')).toBeInTheDocument()
  })

  it('converts text to camelCase', () => {
    render(<CaseConverterTool />)
    const textarea = screen.getByPlaceholderText('Enter text to convert...')
    fireEvent.change(textarea, { target: { value: 'hello world example' } })
    expect(screen.getByDisplayValue('helloWorldExample')).toBeInTheDocument()
  })

  it('converts text to PascalCase', () => {
    render(<CaseConverterTool />)
    const textarea = screen.getByPlaceholderText('Enter text to convert...')
    fireEvent.change(textarea, { target: { value: 'hello world example' } })
    expect(screen.getByDisplayValue('HelloWorldExample')).toBeInTheDocument()
  })

  it('converts text to snake_case', () => {
    render(<CaseConverterTool />)
    const textarea = screen.getByPlaceholderText('Enter text to convert...')
    fireEvent.change(textarea, { target: { value: 'hello world example' } })
    expect(screen.getByDisplayValue('hello_world_example')).toBeInTheDocument()
  })

  it('converts text to kebab-case', () => {
    render(<CaseConverterTool />)
    const textarea = screen.getByPlaceholderText('Enter text to convert...')
    fireEvent.change(textarea, { target: { value: 'hello world example' } })
    expect(screen.getByDisplayValue('hello-world-example')).toBeInTheDocument()
  })

  it('converts text to CONSTANT_CASE', () => {
    render(<CaseConverterTool />)
    const textarea = screen.getByPlaceholderText('Enter text to convert...')
    fireEvent.change(textarea, { target: { value: 'hello world example' } })
    expect(screen.getByDisplayValue('HELLO_WORLD_EXAMPLE')).toBeInTheDocument()
  })

  it('handles camelCase input', () => {
    render(<CaseConverterTool />)
    const textarea = screen.getByPlaceholderText('Enter text to convert...')
    fireEvent.change(textarea, { target: { value: 'helloWorld' } })
    expect(screen.getByDisplayValue('hello_world')).toBeInTheDocument()
    expect(screen.getByDisplayValue('hello-world')).toBeInTheDocument()
  })

  it('handles snake_case input', () => {
    render(<CaseConverterTool />)
    const textarea = screen.getByPlaceholderText('Enter text to convert...')
    fireEvent.change(textarea, { target: { value: 'hello_world' } })
    expect(screen.getByDisplayValue('helloWorld')).toBeInTheDocument()
    expect(screen.getByDisplayValue('HelloWorld')).toBeInTheDocument()
  })

  it('clears output when input is cleared', () => {
    render(<CaseConverterTool />)
    const textarea = screen.getByPlaceholderText('Enter text to convert...')
    fireEvent.change(textarea, { target: { value: 'hello' } })
    // Multiple outputs may have HELLO (uppercase and CONSTANT_CASE for single word)
    expect(screen.getAllByDisplayValue('HELLO').length).toBeGreaterThan(0)

    fireEvent.change(textarea, { target: { value: '' } })
    // All conversion fields should be empty after clearing input
    const inputs = screen.getAllByRole('textbox')
    const readonlyInputs = inputs.filter(i => i.hasAttribute('readonly'))
    readonlyInputs.forEach(input => {
      expect((input as HTMLInputElement).value).toBe('')
    })
  })
})
