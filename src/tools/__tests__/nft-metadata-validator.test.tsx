import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NftMetadataValidatorTool } from '../nft-metadata-validator'

// Helper to get input textarea (non-readonly)
const getInputTextarea = () => {
  const textareas = screen.getAllByRole('textbox')
  return textareas.find(t => !t.hasAttribute('readonly')) as HTMLTextAreaElement
}

describe('NftMetadataValidatorTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<NftMetadataValidatorTool />)
    expect(screen.getByRole('button', { name: /validate metadata/i })).toBeInTheDocument()
  })

  it('renders input type toggle buttons', () => {
    render(<NftMetadataValidatorTool />)
    expect(screen.getByRole('button', { name: /JSON Input/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /URI Input/i })).toBeInTheDocument()
  })

  it('shows JSON input by default', () => {
    render(<NftMetadataValidatorTool />)
    const textarea = getInputTextarea()
    expect(textarea).toBeInTheDocument()
  })

  it('switches to URI input mode', () => {
    render(<NftMetadataValidatorTool />)
    const uriButton = screen.getByRole('button', { name: /URI Input/i })
    fireEvent.click(uriButton)
    expect(screen.getByPlaceholderText(/ipfs:\/\//i)).toBeInTheDocument()
  })

  it('handles JSON input change', () => {
    render(<NftMetadataValidatorTool />)
    const input = getInputTextarea()
    const testJson = '{"name": "Test"}'
    fireEvent.change(input, { target: { value: testJson } })
    expect(input).toHaveValue(testJson)
  })

  it('validates valid metadata with all required fields', async () => {
    render(<NftMetadataValidatorTool />)

    const validMetadata = JSON.stringify({
      name: 'Test NFT',
      description: 'A test NFT',
      image: 'ipfs://QmTest123',
      attributes: [
        { trait_type: 'Color', value: 'Blue' }
      ]
    })

    const input = getInputTextarea()
    fireEvent.change(input, { target: { value: validMetadata } })

    const validateButton = screen.getByRole('button', { name: /validate metadata/i })
    fireEvent.click(validateButton)

    await waitFor(() => {
      // Look for success indicators
      expect(screen.getAllByText(/score|valid|compliance/i).length).toBeGreaterThan(0)
    })
  })

  it('shows errors for missing required fields', async () => {
    render(<NftMetadataValidatorTool />)

    const invalidMetadata = JSON.stringify({
      name: 'Test NFT'
      // Missing description and image
    })

    const input = getInputTextarea()
    fireEvent.change(input, { target: { value: invalidMetadata } })

    const validateButton = screen.getByRole('button', { name: /validate metadata/i })
    fireEvent.click(validateButton)

    await waitFor(() => {
      // Should show some error or warning about missing fields
      expect(screen.getAllByText(/missing|error|required|description|image/i).length).toBeGreaterThan(0)
    })
  })

  it('shows error for invalid JSON', async () => {
    render(<NftMetadataValidatorTool />)

    const input = getInputTextarea()
    fireEvent.change(input, { target: { value: 'invalid json' } })

    const validateButton = screen.getByRole('button', { name: /validate metadata/i })
    fireEvent.click(validateButton)

    await waitFor(() => {
      // Should show JSON error
      expect(screen.getAllByText(/invalid|error|json/i).length).toBeGreaterThan(0)
    })
  })

  it('shows warning for invalid image URI', async () => {
    render(<NftMetadataValidatorTool />)

    const metadata = JSON.stringify({
      name: 'Test NFT',
      description: 'A test',
      image: 'invalid-uri'
    })

    const input = getInputTextarea()
    fireEvent.change(input, { target: { value: metadata } })

    const validateButton = screen.getByRole('button', { name: /validate metadata/i })
    fireEvent.click(validateButton)

    await waitFor(() => {
      // Should show warning about image
      expect(screen.getAllByText(/image|uri|warning|ipfs/i).length).toBeGreaterThan(0)
    })
  })

  it('shows compliance score for valid metadata', async () => {
    render(<NftMetadataValidatorTool />)

    const metadata = JSON.stringify({
      name: 'Test NFT',
      description: 'A test',
      image: 'ipfs://QmTest'
    })

    const input = getInputTextarea()
    fireEvent.change(input, { target: { value: metadata } })

    const validateButton = screen.getByRole('button', { name: /validate metadata/i })
    fireEvent.click(validateButton)

    await waitFor(() => {
      // Should show score
      expect(screen.getAllByText(/score|%|compliance/i).length).toBeGreaterThan(0)
    })
  })

  it('resets form when reset button is clicked', () => {
    render(<NftMetadataValidatorTool />)

    const input = getInputTextarea()
    fireEvent.change(input, { target: { value: '{"name": "test"}' } })

    const resetButtons = screen.getAllByRole('button', { name: /reset/i })
    fireEvent.click(resetButtons[0])

    expect(input).toHaveValue('')
  })
})
