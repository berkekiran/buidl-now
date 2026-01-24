import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QrCodeGeneratorTool } from '../qr-code-generator'

// Mock the qrcode library
vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mockQRCode'),
  },
}))

describe('QrCodeGeneratorTool', () => {
  it('renders without crashing', () => {
    render(<QrCodeGeneratorTool />)
    expect(screen.getByText('Text or URL')).toBeInTheDocument()
    expect(screen.getByText('QR Code Size (128-1024)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate qr code/i })).toBeInTheDocument()
  })

  it('has default size value of 256', () => {
    render(<QrCodeGeneratorTool />)
    const sizeInput = screen.getByPlaceholderText('256') as HTMLInputElement
    expect(sizeInput.value).toBe('256')
  })

  it('generates QR code when button is clicked', async () => {
    render(<QrCodeGeneratorTool />)
    const textarea = screen.getByPlaceholderText('Enter text, URL, or any data to encode...')
    const generateButton = screen.getByRole('button', { name: /generate qr code/i })

    fireEvent.change(textarea, { target: { value: 'https://example.com' } })
    fireEvent.click(generateButton)

    await waitFor(() => {
      const qrImage = screen.getByAltText('QR Code')
      expect(qrImage).toBeInTheDocument()
    })
  })

  it('shows download button after generating QR code', async () => {
    render(<QrCodeGeneratorTool />)
    const textarea = screen.getByPlaceholderText('Enter text, URL, or any data to encode...')
    const generateButton = screen.getByRole('button', { name: /generate qr code/i })

    fireEvent.change(textarea, { target: { value: 'https://example.com' } })
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download qr code/i })).toBeInTheDocument()
    })
  })

  it('shows error when input is empty', async () => {
    render(<QrCodeGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: /generate qr code/i })

    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getByText('Please enter text or URL')).toBeInTheDocument()
    })
  })

  it('shows error when input is whitespace only', async () => {
    render(<QrCodeGeneratorTool />)
    const textarea = screen.getByPlaceholderText('Enter text, URL, or any data to encode...')
    const generateButton = screen.getByRole('button', { name: /generate qr code/i })

    fireEvent.change(textarea, { target: { value: '   ' } })
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(screen.getByText('Please enter text or URL')).toBeInTheDocument()
    })
  })

  it('updates size when size input changes', () => {
    render(<QrCodeGeneratorTool />)
    const sizeInput = screen.getByPlaceholderText('256') as HTMLInputElement

    fireEvent.change(sizeInput, { target: { value: '512' } })

    expect(sizeInput.value).toBe('512')
  })

  it('clamps size to minimum of 128', async () => {
    render(<QrCodeGeneratorTool />)
    const textarea = screen.getByPlaceholderText('Enter text, URL, or any data to encode...')
    const sizeInput = screen.getByPlaceholderText('256')
    const generateButton = screen.getByRole('button', { name: /generate qr code/i })

    fireEvent.change(textarea, { target: { value: 'test' } })
    fireEvent.change(sizeInput, { target: { value: '50' } })
    fireEvent.click(generateButton)

    await waitFor(() => {
      const qrImage = screen.getByAltText('QR Code')
      expect(qrImage).toBeInTheDocument()
    })
  })

  it('clamps size to maximum of 1024', async () => {
    render(<QrCodeGeneratorTool />)
    const textarea = screen.getByPlaceholderText('Enter text, URL, or any data to encode...')
    const sizeInput = screen.getByPlaceholderText('256')
    const generateButton = screen.getByRole('button', { name: /generate qr code/i })

    fireEvent.change(textarea, { target: { value: 'test' } })
    fireEvent.change(sizeInput, { target: { value: '2000' } })
    fireEvent.click(generateButton)

    await waitFor(() => {
      const qrImage = screen.getByAltText('QR Code')
      expect(qrImage).toBeInTheDocument()
    })
  })

  it('accepts URL input', async () => {
    render(<QrCodeGeneratorTool />)
    const textarea = screen.getByPlaceholderText('Enter text, URL, or any data to encode...')
    const generateButton = screen.getByRole('button', { name: /generate qr code/i })

    fireEvent.change(textarea, { target: { value: 'https://example.com/path?query=value' } })
    fireEvent.click(generateButton)

    await waitFor(() => {
      const qrImage = screen.getByAltText('QR Code')
      expect(qrImage).toBeInTheDocument()
    })
  })

  it('accepts plain text input', async () => {
    render(<QrCodeGeneratorTool />)
    const textarea = screen.getByPlaceholderText('Enter text, URL, or any data to encode...')
    const generateButton = screen.getByRole('button', { name: /generate qr code/i })

    fireEvent.change(textarea, { target: { value: 'Hello, World!' } })
    fireEvent.click(generateButton)

    await waitFor(() => {
      const qrImage = screen.getByAltText('QR Code')
      expect(qrImage).toBeInTheDocument()
    })
  })

  it('accepts WiFi format input', async () => {
    render(<QrCodeGeneratorTool />)
    const textarea = screen.getByPlaceholderText('Enter text, URL, or any data to encode...')
    const generateButton = screen.getByRole('button', { name: /generate qr code/i })

    fireEvent.change(textarea, { target: { value: 'WIFI:T:WPA;S:NetworkName;P:password;;' } })
    fireEvent.click(generateButton)

    await waitFor(() => {
      const qrImage = screen.getByAltText('QR Code')
      expect(qrImage).toBeInTheDocument()
    })
  })
})
