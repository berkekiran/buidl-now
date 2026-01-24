import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TokenUriGeneratorTool } from '../token-uri-generator'

// Helper to get input textarea (non-readonly)
const getInputTextarea = () => {
  const textareas = screen.getAllByRole('textbox')
  return textareas.find(t => !t.hasAttribute('readonly')) as HTMLTextAreaElement
}

describe('TokenUriGeneratorTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<TokenUriGeneratorTool />)
    expect(screen.getByRole('button', { name: /generate uris/i })).toBeInTheDocument()
  })

  it('renders storage type selection', () => {
    render(<TokenUriGeneratorTool />)
    expect(screen.getByText('Storage Type')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /IPFS/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Arweave/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Data URI/i })).toBeInTheDocument()
  })

  it('shows JSON input textarea', () => {
    render(<TokenUriGeneratorTool />)
    const textarea = getInputTextarea()
    expect(textarea).toBeInTheDocument()
  })

  it('handles metadata JSON input', () => {
    render(<TokenUriGeneratorTool />)
    const input = getInputTextarea()
    const testJson = '{"name": "Test NFT"}'
    fireEvent.change(input, { target: { value: testJson } })
    expect(input).toHaveValue(testJson)
  })

  it('generates URIs for valid metadata', async () => {
    render(<TokenUriGeneratorTool />)

    const metadata = JSON.stringify({
      name: 'Test NFT',
      description: 'A test NFT',
      image: 'ipfs://QmTest'
    })

    const input = getInputTextarea()
    fireEvent.change(input, { target: { value: metadata } })

    const generateButton = screen.getByRole('button', { name: /generate uris/i })
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getAllByText(/ipfs|uri|arweave|data/i).length).toBeGreaterThan(0)
    })
  })

  it('shows error for invalid JSON', async () => {
    render(<TokenUriGeneratorTool />)

    const input = getInputTextarea()
    fireEvent.change(input, { target: { value: 'invalid json' } })

    const generateButton = screen.getByRole('button', { name: /generate uris/i })
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getAllByText(/invalid|error|json/i).length).toBeGreaterThan(0)
    })
  })

  it('shows error for missing required fields', async () => {
    render(<TokenUriGeneratorTool />)

    const metadata = JSON.stringify({
      name: 'Test'
      // Missing description and image
    })

    const input = getInputTextarea()
    fireEvent.change(input, { target: { value: metadata } })

    const generateButton = screen.getByRole('button', { name: /generate uris/i })
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getAllByText(/name|description|image|required|missing/i).length).toBeGreaterThan(0)
    })
  })

  it('resets form when reset button is clicked', () => {
    render(<TokenUriGeneratorTool />)

    const input = getInputTextarea()
    fireEvent.change(input, { target: { value: '{"name": "test"}' } })

    const resetButtons = screen.getAllByRole('button', { name: /reset/i })
    fireEvent.click(resetButtons[0])

    expect(input).toHaveValue('')
  })

  it('switches storage type selection', () => {
    render(<TokenUriGeneratorTool />)

    const arweaveButton = screen.getByRole('button', { name: /Arweave/i })
    fireEvent.click(arweaveButton)

    expect(arweaveButton).toBeInTheDocument()
  })
})
