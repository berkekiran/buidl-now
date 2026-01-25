import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RegexGeneratorTool } from '../regex-generator'

describe('RegexGeneratorTool', () => {
  it('renders without crashing', () => {
    render(<RegexGeneratorTool />)
    expect(screen.getByText('Describe what you want to match')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Generate Regex' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
    expect(screen.getByText('Or select a common pattern')).toBeInTheDocument()
  })

  it('displays common pattern buttons', () => {
    render(<RegexGeneratorTool />)
    expect(screen.getByRole('button', { name: 'Email' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Phone (US)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'URL' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'IPv4 Address' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Date.*YYYY-MM-DD/i })).toBeInTheDocument()
  })

  it('shows error when generating without description', () => {
    render(<RegexGeneratorTool />)

    const generateButton = screen.getByRole('button', { name: 'Generate Regex' })
    fireEvent.click(generateButton)

    expect(screen.getByText('Please enter a description')).toBeInTheDocument()
  })

  it('generates email pattern from description', () => {
    render(<RegexGeneratorTool />)

    const input = screen.getByPlaceholderText(/email address, phone number/i)
    fireEvent.change(input, { target: { value: 'email address' } })

    const generateButton = screen.getByRole('button', { name: 'Generate Regex' })
    fireEvent.click(generateButton)

    expect(screen.getByText('Generated Regex Pattern')).toBeInTheDocument()
    expect(screen.getByText('Pattern Explanation')).toBeInTheDocument()
  })

  it('generates phone pattern from description', () => {
    render(<RegexGeneratorTool />)

    const input = screen.getByPlaceholderText(/email address, phone number/i)
    fireEvent.change(input, { target: { value: 'phone number' } })

    const generateButton = screen.getByRole('button', { name: 'Generate Regex' })
    fireEvent.click(generateButton)

    expect(screen.getByText('Generated Regex Pattern')).toBeInTheDocument()
    const readonlyInputs = document.querySelectorAll('input[readonly]')
    const patternInput = readonlyInputs[0] as HTMLInputElement
    expect(patternInput.value).toContain('\\d{3}')
  })

  it('generates URL pattern from description', () => {
    render(<RegexGeneratorTool />)

    const input = screen.getByPlaceholderText(/email address, phone number/i)
    fireEvent.change(input, { target: { value: 'website URL' } })

    const generateButton = screen.getByRole('button', { name: 'Generate Regex' })
    fireEvent.click(generateButton)

    const readonlyInputs = document.querySelectorAll('input[readonly]')
    const patternInput = readonlyInputs[0] as HTMLInputElement
    expect(patternInput.value).toContain('https?')
  })

  it('selects common pattern when button is clicked', () => {
    render(<RegexGeneratorTool />)

    const emailButton = screen.getByRole('button', { name: 'Email' })
    fireEvent.click(emailButton)

    expect(screen.getByText('Generated Regex Pattern')).toBeInTheDocument()
    expect(screen.getByText('Pattern Explanation')).toBeInTheDocument()
  })

  it('shows pattern explanation after generation', () => {
    render(<RegexGeneratorTool />)

    const emailButton = screen.getByRole('button', { name: 'Email' })
    fireEvent.click(emailButton)

    expect(screen.getByText('Pattern Explanation')).toBeInTheDocument()
  })

  it('shows test string input after pattern is generated', () => {
    render(<RegexGeneratorTool />)

    const emailButton = screen.getByRole('button', { name: 'Email' })
    fireEvent.click(emailButton)

    expect(screen.getByText('Test String')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Enter text to test/i)).toBeInTheDocument()
  })

  it('tests pattern and shows matches', () => {
    render(<RegexGeneratorTool />)

    // Select email pattern
    const emailButton = screen.getByRole('button', { name: 'Email' })
    fireEvent.click(emailButton)

    // Enter test string
    const testInput = screen.getByPlaceholderText(/Enter text to test/i)
    fireEvent.change(testInput, { target: { value: 'Contact me at test@example.com or info@test.org' } })

    // Test pattern
    const testButton = screen.getByRole('button', { name: 'Test Pattern' })
    fireEvent.click(testButton)

    expect(screen.getByText('Matches (2)')).toBeInTheDocument()
    expect(screen.getByText(/"test@example.com"/)).toBeInTheDocument()
    expect(screen.getByText(/"info@test.org"/)).toBeInTheDocument()
  })

  it('shows no matches message when pattern does not match', () => {
    render(<RegexGeneratorTool />)

    // Select email pattern
    const emailButton = screen.getByRole('button', { name: 'Email' })
    fireEvent.click(emailButton)

    // Enter test string without emails
    const testInput = screen.getByPlaceholderText(/Enter text to test/i)
    fireEvent.change(testInput, { target: { value: 'no emails here' } })

    // Test pattern
    const testButton = screen.getByRole('button', { name: 'Test Pattern' })
    fireEvent.click(testButton)

    expect(screen.getByText('No matches found')).toBeInTheDocument()
  })

  it('resets all fields when reset button is clicked', () => {
    render(<RegexGeneratorTool />)

    // Generate a pattern
    const emailButton = screen.getByRole('button', { name: 'Email' })
    fireEvent.click(emailButton)

    // Enter test string
    const testInput = screen.getByPlaceholderText(/Enter text to test/i)
    fireEvent.change(testInput, { target: { value: 'test@example.com' } })

    // Reset
    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(screen.queryByText('Generated Regex Pattern')).not.toBeInTheDocument()
    expect(screen.queryByText('Pattern Explanation')).not.toBeInTheDocument()
    expect(screen.queryByText('Test String')).not.toBeInTheDocument()
  })

  it('shows error for unrecognized description', () => {
    render(<RegexGeneratorTool />)

    const input = screen.getByPlaceholderText(/email address, phone number/i)
    fireEvent.change(input, { target: { value: 'some random text that does not match anything' } })

    const generateButton = screen.getByRole('button', { name: 'Generate Regex' })
    fireEvent.click(generateButton)

    expect(screen.getByText(/Could not generate pattern/i)).toBeInTheDocument()
  })

  it('generates hex color pattern', () => {
    render(<RegexGeneratorTool />)

    const input = screen.getByPlaceholderText(/email address, phone number/i)
    fireEvent.change(input, { target: { value: 'hex color' } })

    const generateButton = screen.getByRole('button', { name: 'Generate Regex' })
    fireEvent.click(generateButton)

    expect(screen.getByText('Generated Regex Pattern')).toBeInTheDocument()
  })

  it('generates date pattern', () => {
    render(<RegexGeneratorTool />)

    const input = screen.getByPlaceholderText(/email address, phone number/i)
    fireEvent.change(input, { target: { value: 'ISO date' } })

    const generateButton = screen.getByRole('button', { name: 'Generate Regex' })
    fireEvent.click(generateButton)

    const readonlyInputs = document.querySelectorAll('input[readonly]')
    const patternInput = readonlyInputs[0] as HTMLInputElement
    expect(patternInput.value).toContain('\\d{4}')
  })

  it('clears error when valid pattern is generated', () => {
    render(<RegexGeneratorTool />)

    // First generate error
    const input = screen.getByPlaceholderText(/email address, phone number/i)
    fireEvent.change(input, { target: { value: 'xyz123' } })

    const generateButton = screen.getByRole('button', { name: 'Generate Regex' })
    fireEvent.click(generateButton)

    expect(screen.getByText(/Could not generate pattern/i)).toBeInTheDocument()

    // Now generate valid pattern
    fireEvent.change(input, { target: { value: 'email' } })
    fireEvent.click(generateButton)

    expect(screen.queryByText(/Could not generate pattern/i)).not.toBeInTheDocument()
  })
})
