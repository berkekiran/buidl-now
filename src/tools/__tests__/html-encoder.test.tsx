import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HtmlEncoderTool } from '../html-encoder'

describe('HtmlEncoderTool', () => {
  it('renders without crashing', () => {
    render(<HtmlEncoderTool />)
    expect(screen.getByText('Plain Text')).toBeInTheDocument()
    expect(screen.getByText('HTML Encoded Text')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Encode' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Decode' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('encodes ampersand', () => {
    render(<HtmlEncoderTool />)
    // Use label to find the correct textarea
    const plainTextLabel = screen.getByText('Plain Text')
    const plainInput = plainTextLabel.parentElement?.querySelector('textarea') as HTMLTextAreaElement
    const encodeButton = screen.getByRole('button', { name: 'Encode' })

    fireEvent.change(plainInput, { target: { value: 'AT&T' } })
    fireEvent.click(encodeButton)

    expect(screen.getByDisplayValue('AT&amp;T')).toBeInTheDocument()
  })

  it('encodes HTML tags', () => {
    render(<HtmlEncoderTool />)
    const plainTextLabel = screen.getByText('Plain Text')
    const plainInput = plainTextLabel.parentElement?.querySelector('textarea') as HTMLTextAreaElement
    const encodeButton = screen.getByRole('button', { name: 'Encode' })

    fireEvent.change(plainInput, { target: { value: '<div>Hello</div>' } })
    fireEvent.click(encodeButton)

    expect(screen.getByDisplayValue('&lt;div&gt;Hello&lt;&#x2F;div&gt;')).toBeInTheDocument()
  })

  it('encodes quotes', () => {
    render(<HtmlEncoderTool />)
    const plainTextLabel = screen.getByText('Plain Text')
    const plainInput = plainTextLabel.parentElement?.querySelector('textarea') as HTMLTextAreaElement
    const encodeButton = screen.getByRole('button', { name: 'Encode' })

    fireEvent.change(plainInput, { target: { value: 'Say "Hello"' } })
    fireEvent.click(encodeButton)

    expect(screen.getByDisplayValue('Say &quot;Hello&quot;')).toBeInTheDocument()
  })

  it('decodes HTML entities', () => {
    render(<HtmlEncoderTool />)
    const encodedLabel = screen.getByText('HTML Encoded Text')
    const encodedInput = encodedLabel.parentElement?.querySelector('textarea') as HTMLTextAreaElement
    const decodeButton = screen.getByRole('button', { name: 'Decode' })

    fireEvent.change(encodedInput, { target: { value: 'AT&amp;T' } })
    fireEvent.click(decodeButton)

    expect(screen.getByDisplayValue('AT&T')).toBeInTheDocument()
  })

  it('decodes HTML tags', () => {
    render(<HtmlEncoderTool />)
    const encodedLabel = screen.getByText('HTML Encoded Text')
    const encodedInput = encodedLabel.parentElement?.querySelector('textarea') as HTMLTextAreaElement
    const decodeButton = screen.getByRole('button', { name: 'Decode' })

    fireEvent.change(encodedInput, { target: { value: '&lt;div&gt;Hello&lt;&#x2F;div&gt;' } })
    fireEvent.click(decodeButton)

    expect(screen.getByDisplayValue('<div>Hello</div>')).toBeInTheDocument()
  })

  it('resets all fields when reset button is clicked', () => {
    render(<HtmlEncoderTool />)
    const plainTextLabel = screen.getByText('Plain Text')
    const plainInput = plainTextLabel.parentElement?.querySelector('textarea') as HTMLTextAreaElement
    const encodeButton = screen.getByRole('button', { name: 'Encode' })

    fireEvent.change(plainInput, { target: { value: 'Test' } })
    fireEvent.click(encodeButton)

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(plainInput).toHaveValue('')
  })

  it('handles empty input for encode', () => {
    render(<HtmlEncoderTool />)
    const encodeButton = screen.getByRole('button', { name: 'Encode' })

    fireEvent.click(encodeButton)

    const encodedLabel = screen.getByText('HTML Encoded Text')
    const encodedInput = encodedLabel.parentElement?.querySelector('textarea') as HTMLTextAreaElement
    expect(encodedInput).toHaveValue('')
  })

  it('handles empty input for decode', () => {
    render(<HtmlEncoderTool />)
    const decodeButton = screen.getByRole('button', { name: 'Decode' })

    fireEvent.click(decodeButton)

    const plainTextLabel = screen.getByText('Plain Text')
    const plainInput = plainTextLabel.parentElement?.querySelector('textarea') as HTMLTextAreaElement
    expect(plainInput).toHaveValue('')
  })

  it('encodes single quotes', () => {
    render(<HtmlEncoderTool />)
    const plainTextLabel = screen.getByText('Plain Text')
    const plainInput = plainTextLabel.parentElement?.querySelector('textarea') as HTMLTextAreaElement
    const encodeButton = screen.getByRole('button', { name: 'Encode' })

    fireEvent.change(plainInput, { target: { value: "it's" } })
    fireEvent.click(encodeButton)

    expect(screen.getByDisplayValue('it&#39;s')).toBeInTheDocument()
  })
})
