import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { UrlEncoderTool } from '../url-encoder'

describe('UrlEncoderTool', () => {
  it('renders without crashing', () => {
    render(<UrlEncoderTool />)
    expect(screen.getByText('Decoded Text')).toBeInTheDocument()
    expect(screen.getByText('URL Encoded Text')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Encode' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Decode' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('encodes text with spaces', () => {
    render(<UrlEncoderTool />)
    const decodedLabel = screen.getByText('Decoded Text')
    const decodedInput = decodedLabel.parentElement?.querySelector('textarea') as HTMLTextAreaElement
    const encodeButton = screen.getByRole('button', { name: 'Encode' })

    fireEvent.change(decodedInput, { target: { value: 'Hello World' } })
    fireEvent.click(encodeButton)

    expect(screen.getByDisplayValue('Hello%20World')).toBeInTheDocument()
  })

  it('encodes special characters', () => {
    render(<UrlEncoderTool />)
    const decodedLabel = screen.getByText('Decoded Text')
    const decodedInput = decodedLabel.parentElement?.querySelector('textarea') as HTMLTextAreaElement
    const encodeButton = screen.getByRole('button', { name: 'Encode' })

    fireEvent.change(decodedInput, { target: { value: 'user@example.com' } })
    fireEvent.click(encodeButton)

    expect(screen.getByDisplayValue('user%40example.com')).toBeInTheDocument()
  })

  it('decodes URL encoded text', () => {
    render(<UrlEncoderTool />)
    const encodedLabel = screen.getByText('URL Encoded Text')
    const encodedInput = encodedLabel.parentElement?.querySelector('textarea') as HTMLTextAreaElement
    const decodeButton = screen.getByRole('button', { name: 'Decode' })

    fireEvent.change(encodedInput, { target: { value: 'Hello%20World' } })
    fireEvent.click(decodeButton)

    expect(screen.getByDisplayValue('Hello World')).toBeInTheDocument()
  })

  it('decodes special characters', () => {
    render(<UrlEncoderTool />)
    const encodedLabel = screen.getByText('URL Encoded Text')
    const encodedInput = encodedLabel.parentElement?.querySelector('textarea') as HTMLTextAreaElement
    const decodeButton = screen.getByRole('button', { name: 'Decode' })

    fireEvent.change(encodedInput, { target: { value: 'user%40example.com' } })
    fireEvent.click(decodeButton)

    expect(screen.getByDisplayValue('user@example.com')).toBeInTheDocument()
  })

  it('resets all fields when reset button is clicked', () => {
    render(<UrlEncoderTool />)
    const decodedLabel = screen.getByText('Decoded Text')
    const decodedInput = decodedLabel.parentElement?.querySelector('textarea') as HTMLTextAreaElement
    const encodeButton = screen.getByRole('button', { name: 'Encode' })

    fireEvent.change(decodedInput, { target: { value: 'Test' } })
    fireEvent.click(encodeButton)

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(decodedInput).toHaveValue('')
  })

  it('handles empty input for encode', () => {
    render(<UrlEncoderTool />)
    const encodeButton = screen.getByRole('button', { name: 'Encode' })

    fireEvent.click(encodeButton)

    // Should not crash and encoded should be empty
    const encodedLabel = screen.getByText('URL Encoded Text')
    const encodedInput = encodedLabel.parentElement?.querySelector('textarea') as HTMLTextAreaElement
    expect(encodedInput).toHaveValue('')
  })

  it('handles empty input for decode', () => {
    render(<UrlEncoderTool />)
    const decodeButton = screen.getByRole('button', { name: 'Decode' })

    fireEvent.click(decodeButton)

    // Should not crash and decoded should be empty
    const decodedLabel = screen.getByText('Decoded Text')
    const decodedInput = decodedLabel.parentElement?.querySelector('textarea') as HTMLTextAreaElement
    expect(decodedInput).toHaveValue('')
  })

  it('encodes query parameter characters', () => {
    render(<UrlEncoderTool />)
    const decodedLabel = screen.getByText('Decoded Text')
    const decodedInput = decodedLabel.parentElement?.querySelector('textarea') as HTMLTextAreaElement
    const encodeButton = screen.getByRole('button', { name: 'Encode' })

    fireEvent.change(decodedInput, { target: { value: 'name=John Doe&age=25' } })
    fireEvent.click(encodeButton)

    expect(screen.getByDisplayValue('name%3DJohn%20Doe%26age%3D25')).toBeInTheDocument()
  })
})
