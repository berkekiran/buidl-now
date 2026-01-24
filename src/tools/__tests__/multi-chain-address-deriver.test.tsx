import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MultiChainAddressDeriverTool } from '../multi-chain-address-deriver'

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}))

describe('MultiChainAddressDeriverTool', () => {
  it('renders without crashing', () => {
    render(<MultiChainAddressDeriverTool />)
    expect(screen.getByText('Security Warning')).toBeInTheDocument()
    expect(screen.getByText('Input Type')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /mnemonic phrase/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /private key/i })).toBeInTheDocument()
  })

  it('shows mnemonic input by default', () => {
    render(<MultiChainAddressDeriverTool />)
    expect(screen.getByText('Mnemonic Phrase (12 or 24 words)')).toBeInTheDocument()
    expect(screen.getByText('Derivation Path')).toBeInTheDocument()
  })

  it('switches to private key input', () => {
    render(<MultiChainAddressDeriverTool />)

    const privateKeyButton = screen.getByRole('button', { name: /private key/i })
    fireEvent.click(privateKeyButton)

    // There will be multiple "Private Key" elements (button + label)
    expect(screen.getAllByText('Private Key').length).toBeGreaterThan(0)
    expect(screen.queryByText('Mnemonic Phrase (12 or 24 words)')).not.toBeInTheDocument()
  })

  it('has derive addresses button', () => {
    render(<MultiChainAddressDeriverTool />)
    expect(screen.getByRole('button', { name: /derive addresses/i })).toBeInTheDocument()
  })

  it('shows error for invalid mnemonic', () => {
    render(<MultiChainAddressDeriverTool />)

    const mnemonicTextarea = screen.getByPlaceholderText(/word1 word2 word3/i)
    fireEvent.change(mnemonicTextarea, { target: { value: 'invalid mnemonic' } })

    const deriveButton = screen.getByRole('button', { name: /derive addresses/i })
    fireEvent.click(deriveButton)

    expect(screen.getByText(/mnemonic must be 12 or 24 words/i)).toBeInTheDocument()
  })

  it('shows error for empty mnemonic', () => {
    render(<MultiChainAddressDeriverTool />)

    const deriveButton = screen.getByRole('button', { name: /derive addresses/i })
    fireEvent.click(deriveButton)

    expect(screen.getByText(/mnemonic phrase is required/i)).toBeInTheDocument()
  })

  it('shows error for invalid private key length', () => {
    render(<MultiChainAddressDeriverTool />)

    const privateKeyButton = screen.getByRole('button', { name: /private key/i })
    fireEvent.click(privateKeyButton)

    const privateKeyInput = screen.getByPlaceholderText(/0x1234567890abcdef/i)
    fireEvent.change(privateKeyInput, { target: { value: '0x123' } })

    const deriveButton = screen.getByRole('button', { name: /derive addresses/i })
    fireEvent.click(deriveButton)

    expect(screen.getByText(/invalid private key length/i)).toBeInTheDocument()
  })

  it('shows error for empty private key', () => {
    render(<MultiChainAddressDeriverTool />)

    const privateKeyButton = screen.getByRole('button', { name: /private key/i })
    fireEvent.click(privateKeyButton)

    const deriveButton = screen.getByRole('button', { name: /derive addresses/i })
    fireEvent.click(deriveButton)

    expect(screen.getByText(/private key is required/i)).toBeInTheDocument()
  })

  it('has default derivation path', () => {
    render(<MultiChainAddressDeriverTool />)

    const derivationPathInput = screen.getByPlaceholderText("m/44'/60'/0'/0/0")
    expect(derivationPathInput).toHaveValue("m/44'/60'/0'/0/0")
  })

  it('shows security warnings', () => {
    render(<MultiChainAddressDeriverTool />)
    expect(screen.getByText(/this tool runs entirely in your browser/i)).toBeInTheDocument()
    expect(screen.getByText(/never share your private key or mnemonic/i)).toBeInTheDocument()
  })

  it('derives address from valid private key', () => {
    render(<MultiChainAddressDeriverTool />)

    const privateKeyButton = screen.getByRole('button', { name: /private key/i })
    fireEvent.click(privateKeyButton)

    // Valid 64-character private key (without 0x)
    const privateKey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

    const privateKeyInput = screen.getByPlaceholderText(/0x1234567890abcdef/i)
    fireEvent.change(privateKeyInput, { target: { value: privateKey } })

    const deriveButton = screen.getByRole('button', { name: /derive addresses/i })
    fireEvent.click(deriveButton)

    expect(screen.getByText('Addresses Across Chains')).toBeInTheDocument()
    expect(screen.getByText('Ethereum')).toBeInTheDocument()
    expect(screen.getByText('Polygon')).toBeInTheDocument()
    expect(screen.getByText('Arbitrum')).toBeInTheDocument()
  })
})
