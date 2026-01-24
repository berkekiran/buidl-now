import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { JwtDecoderTool } from '../jwt-decoder'

describe('JwtDecoderTool', () => {
  const validJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

  it('renders without crashing', () => {
    render(<JwtDecoderTool />)
    expect(screen.getByText('JWT Token')).toBeInTheDocument()
  })

  it('shows placeholder text', () => {
    render(<JwtDecoderTool />)
    expect(screen.getByPlaceholderText(/Paste your JWT token here/)).toBeInTheDocument()
  })

  it('decodes valid JWT on input change', () => {
    render(<JwtDecoderTool />)
    const textarea = screen.getByPlaceholderText(/Paste your JWT token here/)
    fireEvent.change(textarea, { target: { value: validJwt } })

    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Payload')).toBeInTheDocument()
    expect(screen.getByText('Signature')).toBeInTheDocument()
  })

  it('shows decoded header content', () => {
    render(<JwtDecoderTool />)
    const textarea = screen.getByPlaceholderText(/Paste your JWT token here/)
    fireEvent.change(textarea, { target: { value: validJwt } })

    expect(screen.getByText(/"alg": "HS256"/)).toBeInTheDocument()
    expect(screen.getByText(/"typ": "JWT"/)).toBeInTheDocument()
  })

  it('shows decoded payload content', () => {
    render(<JwtDecoderTool />)
    const textarea = screen.getByPlaceholderText(/Paste your JWT token here/)
    fireEvent.change(textarea, { target: { value: validJwt } })

    expect(screen.getByText(/"sub": "1234567890"/)).toBeInTheDocument()
    expect(screen.getByText(/"name": "John Doe"/)).toBeInTheDocument()
  })

  it('shows error for invalid JWT format', () => {
    render(<JwtDecoderTool />)
    const textarea = screen.getByPlaceholderText(/Paste your JWT token here/)
    fireEvent.change(textarea, { target: { value: 'invalid.jwt' } })

    expect(screen.getByText(/Invalid JWT format/)).toBeInTheDocument()
  })

  it('shows error for JWT with invalid parts', () => {
    render(<JwtDecoderTool />)
    const textarea = screen.getByPlaceholderText(/Paste your JWT token here/)
    fireEvent.change(textarea, { target: { value: 'only.two' } })

    expect(screen.getByText(/Invalid JWT format/)).toBeInTheDocument()
  })

  it('handles JWT with timestamp claims', () => {
    render(<JwtDecoderTool />)
    // JWT with iat claim
    const textarea = screen.getByPlaceholderText(/Paste your JWT token here/)
    fireEvent.change(textarea, { target: { value: validJwt } })

    expect(screen.getByText('Timestamp Claims:')).toBeInTheDocument()
    expect(screen.getByText(/Issued At \(iat\):/)).toBeInTheDocument()
  })

  it('clears decoded content when input is cleared', () => {
    render(<JwtDecoderTool />)
    const textarea = screen.getByPlaceholderText(/Paste your JWT token here/)
    fireEvent.change(textarea, { target: { value: validJwt } })
    expect(screen.getByText('Header')).toBeInTheDocument()

    fireEvent.change(textarea, { target: { value: '' } })
    expect(screen.queryByText('Header')).not.toBeInTheDocument()
  })

  it('shows encoded parts', () => {
    render(<JwtDecoderTool />)
    const textarea = screen.getByPlaceholderText(/Paste your JWT token here/)
    fireEvent.change(textarea, { target: { value: validJwt } })

    expect(screen.getAllByText('Encoded:').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Decoded:').length).toBeGreaterThan(0)
  })

  it('shows signature info text', () => {
    render(<JwtDecoderTool />)
    const textarea = screen.getByPlaceholderText(/Paste your JWT token here/)
    fireEvent.change(textarea, { target: { value: validJwt } })

    expect(screen.getByText(/The signature is used to verify/)).toBeInTheDocument()
  })
})
