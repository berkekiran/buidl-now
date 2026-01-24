import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RegexTesterTool } from '../regex-tester'

describe('RegexTesterTool', () => {
  it('renders without crashing', () => {
    render(<RegexTesterTool />)
    expect(screen.getByText('Regular Expression Pattern')).toBeInTheDocument()
    expect(screen.getByText('Flags')).toBeInTheDocument()
    expect(screen.getByText('Test String')).toBeInTheDocument()
  })

  it('displays flag descriptions', () => {
    render(<RegexTesterTool />)
    expect(screen.getByText(/g: global, i: case insensitive/)).toBeInTheDocument()
  })

  it('has default flag value of g', () => {
    render(<RegexTesterTool />)
    const flagsInput = screen.getByPlaceholderText('g')
    expect(flagsInput).toHaveValue('g')
  })

  it('finds matches for digit pattern', () => {
    render(<RegexTesterTool />)
    const patternInput = screen.getByPlaceholderText('\\d+')
    const testInput = screen.getByPlaceholderText('Enter text to test against the regex...')

    fireEvent.change(patternInput, { target: { value: '\\d+' } })
    fireEvent.change(testInput, { target: { value: 'abc123def456' } })
    fireEvent.keyUp(testInput)

    expect(screen.getByText('Matches (2)')).toBeInTheDocument()
    expect(screen.getByText(/"123"/)).toBeInTheDocument()
    expect(screen.getByText(/"456"/)).toBeInTheDocument()
  })

  it('shows no matches message when pattern does not match', () => {
    render(<RegexTesterTool />)
    const patternInput = screen.getByPlaceholderText('\\d+')
    const testInput = screen.getByPlaceholderText('Enter text to test against the regex...')

    fireEvent.change(patternInput, { target: { value: '\\d+' } })
    fireEvent.change(testInput, { target: { value: 'no numbers here' } })
    fireEvent.keyUp(testInput)

    expect(screen.getByText('No matches found')).toBeInTheDocument()
  })

  it('shows error for invalid regex pattern', () => {
    render(<RegexTesterTool />)
    const patternInput = screen.getByPlaceholderText('\\d+')
    const testInput = screen.getByPlaceholderText('Enter text to test against the regex...')

    fireEvent.change(patternInput, { target: { value: '[invalid' } })
    fireEvent.change(testInput, { target: { value: 'test' } })
    fireEvent.keyUp(patternInput)

    // Should show error message
    const errorElement = screen.getByText(/Invalid/i)
    expect(errorElement).toBeInTheDocument()
  })

  it('supports case insensitive flag', () => {
    render(<RegexTesterTool />)
    const patternInput = screen.getByPlaceholderText('\\d+')
    const flagsInput = screen.getByPlaceholderText('g')
    const testInput = screen.getByPlaceholderText('Enter text to test against the regex...')

    fireEvent.change(patternInput, { target: { value: 'hello' } })
    fireEvent.change(flagsInput, { target: { value: 'gi' } })
    fireEvent.change(testInput, { target: { value: 'Hello HELLO hello' } })
    fireEvent.keyUp(testInput)

    expect(screen.getByText('Matches (3)')).toBeInTheDocument()
  })

  it('displays match position', () => {
    render(<RegexTesterTool />)
    const patternInput = screen.getByPlaceholderText('\\d+')
    const testInput = screen.getByPlaceholderText('Enter text to test against the regex...')

    fireEvent.change(patternInput, { target: { value: 'test' } })
    fireEvent.change(testInput, { target: { value: 'this is a test' } })
    fireEvent.keyUp(testInput)

    expect(screen.getByText('Position: 10')).toBeInTheDocument()
  })

  it('displays captured groups', () => {
    render(<RegexTesterTool />)
    const patternInput = screen.getByPlaceholderText('\\d+')
    const testInput = screen.getByPlaceholderText('Enter text to test against the regex...')

    fireEvent.change(patternInput, { target: { value: '(\\d+)-(\\d+)' } })
    fireEvent.change(testInput, { target: { value: '123-456' } })
    fireEvent.keyUp(testInput)

    expect(screen.getByText(/\$1="123"/)).toBeInTheDocument()
    expect(screen.getByText(/\$2="456"/)).toBeInTheDocument()
  })

  it('does not show matches when pattern is empty', () => {
    render(<RegexTesterTool />)
    const testInput = screen.getByPlaceholderText('Enter text to test against the regex...')

    fireEvent.change(testInput, { target: { value: 'test' } })
    fireEvent.keyUp(testInput)

    expect(screen.queryByText(/Matches/)).not.toBeInTheDocument()
    expect(screen.queryByText('No matches found')).not.toBeInTheDocument()
  })

  it('does not show matches when test string is empty', () => {
    render(<RegexTesterTool />)
    const patternInput = screen.getByPlaceholderText('\\d+')

    fireEvent.change(patternInput, { target: { value: 'test' } })
    fireEvent.keyUp(patternInput)

    expect(screen.queryByText(/Matches/)).not.toBeInTheDocument()
    expect(screen.queryByText('No matches found')).not.toBeInTheDocument()
  })

  it('tests phone number pattern', () => {
    render(<RegexTesterTool />)
    const patternInput = screen.getByPlaceholderText('\\d+')
    const testInput = screen.getByPlaceholderText('Enter text to test against the regex...')

    fireEvent.change(patternInput, { target: { value: '\\d{3}-\\d{3}-\\d{4}' } })
    fireEvent.change(testInput, { target: { value: 'Call me at 555-123-4567 or 555-987-6543' } })
    fireEvent.keyUp(testInput)

    expect(screen.getByText('Matches (2)')).toBeInTheDocument()
    expect(screen.getByText(/"555-123-4567"/)).toBeInTheDocument()
    expect(screen.getByText(/"555-987-6543"/)).toBeInTheDocument()
  })
})
