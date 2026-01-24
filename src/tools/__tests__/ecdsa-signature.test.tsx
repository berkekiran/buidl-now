import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EcdsaSignatureTool } from '../ecdsa-signature'

describe('EcdsaSignatureTool', () => {
  it('renders without crashing', () => {
    render(<EcdsaSignatureTool />)
    expect(screen.getByText('Signature (hex string)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /parse/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('parses a valid 65-byte signature', () => {
    render(<EcdsaSignatureTool />)

    // Valid 65-byte signature (130 hex chars)
    const signature = '0x' + 'a'.repeat(64) + 'b'.repeat(64) + '1b'

    const textarea = screen.getByPlaceholderText(/0xabcdef/i)
    fireEvent.change(textarea, { target: { value: signature } })

    const parseButton = screen.getByRole('button', { name: /parse/i })
    fireEvent.click(parseButton)

    expect(screen.getByText('Component: r')).toBeInTheDocument()
    expect(screen.getByText('Component: s')).toBeInTheDocument()
    expect(screen.getByText('Component: v')).toBeInTheDocument()
    expect(screen.getByText('Y Parity')).toBeInTheDocument()
  })

  it('parses a valid 64-byte signature', () => {
    render(<EcdsaSignatureTool />)

    // Valid 64-byte signature (128 hex chars)
    const signature = '0x' + 'c'.repeat(128)

    const textarea = screen.getByPlaceholderText(/0xabcdef/i)
    fireEvent.change(textarea, { target: { value: signature } })

    const parseButton = screen.getByRole('button', { name: /parse/i })
    fireEvent.click(parseButton)

    expect(screen.getByText('Component: r')).toBeInTheDocument()
    expect(screen.getByText('Component: s')).toBeInTheDocument()
  })

  it('shows error for invalid hex string', () => {
    render(<EcdsaSignatureTool />)

    const textarea = screen.getByPlaceholderText(/0xabcdef/i)
    fireEvent.change(textarea, { target: { value: '0xghijkl' } })

    const parseButton = screen.getByRole('button', { name: /parse/i })
    fireEvent.click(parseButton)

    expect(screen.getByText(/invalid hex string/i)).toBeInTheDocument()
  })

  it('shows error for invalid signature length', () => {
    render(<EcdsaSignatureTool />)

    // Too short signature
    const signature = '0x' + 'a'.repeat(100)

    const textarea = screen.getByPlaceholderText(/0xabcdef/i)
    fireEvent.change(textarea, { target: { value: signature } })

    const parseButton = screen.getByRole('button', { name: /parse/i })
    fireEvent.click(parseButton)

    expect(screen.getByText(/signature must be 64 or 65 bytes/i)).toBeInTheDocument()
  })

  it('handles reset correctly', () => {
    render(<EcdsaSignatureTool />)

    const signature = '0x' + 'a'.repeat(64) + 'b'.repeat(64) + '1b'

    const textarea = screen.getByPlaceholderText(/0xabcdef/i)
    fireEvent.change(textarea, { target: { value: signature } })

    const parseButton = screen.getByRole('button', { name: /parse/i })
    fireEvent.click(parseButton)

    expect(screen.getByText('Component: r')).toBeInTheDocument()

    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)

    expect(textarea).toHaveValue('')
    expect(screen.queryByText('Component: r')).not.toBeInTheDocument()
  })

  it('parses signature without 0x prefix', () => {
    render(<EcdsaSignatureTool />)

    // Without 0x prefix
    const signature = 'a'.repeat(64) + 'b'.repeat(64) + '1c'

    const textarea = screen.getByPlaceholderText(/0xabcdef/i)
    fireEvent.change(textarea, { target: { value: signature } })

    const parseButton = screen.getByRole('button', { name: /parse/i })
    fireEvent.click(parseButton)

    expect(screen.getByText('Component: r')).toBeInTheDocument()
  })

  it('displays info about ECDSA signatures', () => {
    render(<EcdsaSignatureTool />)
    expect(screen.getByText('About ECDSA Signatures')).toBeInTheDocument()
    expect(screen.getByText(/27 or 28: Legacy Ethereum signatures/i)).toBeInTheDocument()
  })
})
