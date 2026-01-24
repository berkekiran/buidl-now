import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SignatureVerifierTool } from '../signature-verifier'

describe('SignatureVerifierTool', () => {
  it('renders without crashing', () => {
    render(<SignatureVerifierTool />)
    expect(screen.getByText('Original Message')).toBeInTheDocument()
    expect(screen.getByText('Signature (65 bytes hex)')).toBeInTheDocument()
    expect(screen.getByText('Expected Signer Address (Optional)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Verify Signature' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays placeholder texts', () => {
    render(<SignatureVerifierTool />)
    expect(screen.getByPlaceholderText('Hello, Ethereum!')).toBeInTheDocument()
  })

  it('has message and signature input fields', () => {
    render(<SignatureVerifierTool />)
    const textareas = screen.getAllByRole('textbox')
    expect(textareas.length).toBeGreaterThanOrEqual(2)
  })

  it('allows entering message', () => {
    render(<SignatureVerifierTool />)
    const messageInput = screen.getByPlaceholderText('Hello, Ethereum!')

    fireEvent.change(messageInput, { target: { value: 'Test message' } })

    expect(messageInput).toHaveValue('Test message')
  })

  it('allows entering signature', () => {
    render(<SignatureVerifierTool />)
    const signatureInputs = screen.getAllByPlaceholderText('0x...')
    const signatureInput = signatureInputs[0] // First one is signature

    fireEvent.change(signatureInput, { target: { value: '0x1234' } })

    expect(signatureInput).toHaveValue('0x1234')
  })

  it('allows entering expected address', () => {
    render(<SignatureVerifierTool />)
    const addressInputs = screen.getAllByPlaceholderText('0x...')
    const addressInput = addressInputs[1] // Second one is expected address

    fireEvent.change(addressInput, { target: { value: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' } })

    expect(addressInput).toHaveValue('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
  })

  it('resets all fields when reset button is clicked', () => {
    render(<SignatureVerifierTool />)
    const messageInput = screen.getByPlaceholderText('Hello, Ethereum!')

    fireEvent.change(messageInput, { target: { value: 'Test message' } })

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(messageInput).toHaveValue('')
  })

  it('does not verify without message', async () => {
    render(<SignatureVerifierTool />)
    const verifyButton = screen.getByRole('button', { name: 'Verify Signature' })

    fireEvent.click(verifyButton)

    // Should not show any result
    expect(screen.queryByText('Recovered Signer Address')).not.toBeInTheDocument()
  })

  it('does not verify without signature', async () => {
    render(<SignatureVerifierTool />)
    const messageInput = screen.getByPlaceholderText('Hello, Ethereum!')
    const verifyButton = screen.getByRole('button', { name: 'Verify Signature' })

    fireEvent.change(messageInput, { target: { value: 'Test message' } })
    fireEvent.click(verifyButton)

    // Should not show any result
    expect(screen.queryByText('Recovered Signer Address')).not.toBeInTheDocument()
  })

  // Note: Testing actual signature verification requires valid signatures
  // which would require mocking the viem library or using actual test vectors.
  // The following test verifies the component handles invalid signatures gracefully.
  it('handles invalid signature gracefully', async () => {
    render(<SignatureVerifierTool />)
    const messageInput = screen.getByPlaceholderText('Hello, Ethereum!')
    const signatureInputs = screen.getAllByPlaceholderText('0x...')
    const signatureInput = signatureInputs[0]
    const verifyButton = screen.getByRole('button', { name: 'Verify Signature' })

    fireEvent.change(messageInput, { target: { value: 'Test message' } })
    fireEvent.change(signatureInput, { target: { value: '0x1234invalid' } })
    fireEvent.click(verifyButton)

    // Should not crash and should not show recovered address
    await waitFor(() => {
      expect(screen.queryByText('Recovered Signer Address')).not.toBeInTheDocument()
    })
  })
})
