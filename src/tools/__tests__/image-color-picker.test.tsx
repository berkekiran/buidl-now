import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ImageColorPickerTool } from '../image-color-picker'

describe('ImageColorPickerTool', () => {
  it('renders without crashing', () => {
    render(<ImageColorPickerTool />)
    expect(screen.getByText('Select Image')).toBeInTheDocument()
    expect(screen.getByText(/click on the image to pick a color/i)).toBeInTheDocument()
  })

  it('has a file input for image selection', () => {
    render(<ImageColorPickerTool />)
    const fileInput = document.querySelector('input[type="file"]')
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveAttribute('accept', 'image/*')
  })

  it('shows error for non-image files', () => {
    render(<ImageColorPickerTool />)

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
    render(<ImageColorPickerTool />)

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large-image.png', { type: 'image/png' })
    Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 })

    Object.defineProperty(fileInput, 'files', {
      value: [largeFile],
      writable: false,
    })

    fireEvent.change(fileInput)

    expect(screen.getByText('Image size must be less than 5MB')).toBeInTheDocument()
  })

  it('does not show extract button or picked color initially', () => {
    render(<ImageColorPickerTool />)
    expect(screen.queryByRole('button', { name: /extract dominant colors/i })).not.toBeInTheDocument()
    expect(screen.queryByText('Picked Color')).not.toBeInTheDocument()
  })

  it('has hidden canvas for color extraction', () => {
    render(<ImageColorPickerTool />)
    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveClass('hidden')
  })
})
