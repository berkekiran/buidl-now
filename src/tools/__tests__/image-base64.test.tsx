import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ImageBase64Tool } from '../image-base64'

describe('ImageBase64Tool', () => {
  it('renders without crashing', () => {
    render(<ImageBase64Tool />)
    expect(screen.getByText('Select Image')).toBeInTheDocument()
    expect(screen.getByText(/maximum file size: 5mb/i)).toBeInTheDocument()
  })

  it('has a file input for image selection', () => {
    render(<ImageBase64Tool />)
    const fileInput = document.querySelector('input[type="file"]')
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveAttribute('accept', 'image/*')
  })

  it('shows error for non-image files', () => {
    render(<ImageBase64Tool />)

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

    const nonImageFile = new File(['test content'], 'test.txt', { type: 'text/plain' })

    Object.defineProperty(fileInput, 'files', {
      value: [nonImageFile],
      writable: false,
    })

    fireEvent.change(fileInput)

    expect(screen.getByText('Please select a valid image file')).toBeInTheDocument()
  })

  it('shows error for files exceeding 5MB', () => {
    render(<ImageBase64Tool />)

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

    // Create a mock file larger than 5MB
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large-image.png', { type: 'image/png' })
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 })

    Object.defineProperty(fileInput, 'files', {
      value: [largeFile],
      writable: false,
    })

    fireEvent.change(fileInput)

    expect(screen.getByText('Image size must be less than 5MB')).toBeInTheDocument()
  })

  it('does not show preview initially', () => {
    render(<ImageBase64Tool />)
    expect(screen.queryByText('Image Preview')).not.toBeInTheDocument()
    expect(screen.queryByText('Base64 Data URL')).not.toBeInTheDocument()
  })
})
