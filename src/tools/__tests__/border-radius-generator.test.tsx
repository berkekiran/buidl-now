import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BorderRadiusGeneratorTool } from '../border-radius-generator'

describe('BorderRadiusGeneratorTool', () => {
  it('renders without crashing', () => {
    render(<BorderRadiusGeneratorTool />)
    expect(screen.getByText('Unit')).toBeInTheDocument()
    expect(screen.getByText('Presets')).toBeInTheDocument()
    expect(screen.getByText('Preview')).toBeInTheDocument()
    expect(screen.getByText('CSS Code')).toBeInTheDocument()
  })

  it('displays unit buttons', () => {
    render(<BorderRadiusGeneratorTool />)
    expect(screen.getByRole('button', { name: 'px' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '%' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'rem' })).toBeInTheDocument()
  })

  it('displays preset buttons', () => {
    render(<BorderRadiusGeneratorTool />)
    expect(screen.getByRole('button', { name: 'none' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'sm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'md' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'lg' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'xl' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2xl' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'full' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'pill' })).toBeInTheDocument()
  })

  it('displays corner controls', () => {
    render(<BorderRadiusGeneratorTool />)
    expect(screen.getByText(/Top Left:/)).toBeInTheDocument()
    expect(screen.getByText(/Top Right:/)).toBeInTheDocument()
    expect(screen.getByText(/Bottom Left:/)).toBeInTheDocument()
    expect(screen.getByText(/Bottom Right:/)).toBeInTheDocument()
  })

  it('has link all corners checkbox', () => {
    render(<BorderRadiusGeneratorTool />)
    expect(screen.getByText('Link all corners')).toBeInTheDocument()
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('displays CSS output with default values', () => {
    render(<BorderRadiusGeneratorTool />)
    const readonlyInputs = document.querySelectorAll('input[readonly]')
    const cssInput = readonlyInputs[0] as HTMLInputElement
    expect(cssInput.value).toBe('border-radius: 12px;')
  })

  it('updates all corners when linked and one slider changes', () => {
    render(<BorderRadiusGeneratorTool />)

    const sliders = document.querySelectorAll('input[type="range"]')
    const topLeftSlider = Array.from(sliders).find(s => {
      const label = s.closest('div')?.querySelector('label')
      return label?.textContent?.includes('Top Left')
    }) as HTMLInputElement

    if (topLeftSlider) {
      fireEvent.change(topLeftSlider, { target: { value: '20' } })
      const readonlyInputs = document.querySelectorAll('input[readonly]')
      const cssInput = readonlyInputs[0] as HTMLInputElement
      expect(cssInput.value).toBe('border-radius: 20px;')
    }
  })

  it('updates individual corners when unlinked', () => {
    render(<BorderRadiusGeneratorTool />)

    // Unlink corners
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    const sliders = document.querySelectorAll('input[type="range"]')
    const topLeftSlider = Array.from(sliders).find(s => {
      const label = s.closest('div')?.querySelector('label')
      return label?.textContent?.includes('Top Left')
    }) as HTMLInputElement

    if (topLeftSlider) {
      fireEvent.change(topLeftSlider, { target: { value: '30' } })
      const readonlyInputs = document.querySelectorAll('input[readonly]')
      const cssInput = readonlyInputs[0] as HTMLInputElement
      expect(cssInput.value).toContain('30px')
    }
  })

  it('applies none preset', () => {
    render(<BorderRadiusGeneratorTool />)

    const noneButton = screen.getByRole('button', { name: 'none' })
    fireEvent.click(noneButton)

    const readonlyInputs = document.querySelectorAll('input[readonly]')
    const cssInput = readonlyInputs[0] as HTMLInputElement
    expect(cssInput.value).toBe('border-radius: 0px;')
  })

  it('applies full preset', () => {
    render(<BorderRadiusGeneratorTool />)

    const fullButton = screen.getByRole('button', { name: 'full' })
    fireEvent.click(fullButton)

    const readonlyInputs = document.querySelectorAll('input[readonly]')
    const cssInput = readonlyInputs[0] as HTMLInputElement
    expect(cssInput.value).toBe('border-radius: 9999px;')
  })

  it('applies pill preset and changes unit to %', () => {
    render(<BorderRadiusGeneratorTool />)

    const pillButton = screen.getByRole('button', { name: 'pill' })
    fireEvent.click(pillButton)

    const readonlyInputs = document.querySelectorAll('input[readonly]')
    const cssInput = readonlyInputs[0] as HTMLInputElement
    expect(cssInput.value).toBe('border-radius: 50%;')
  })

  it('changes unit to rem when rem button is clicked', () => {
    render(<BorderRadiusGeneratorTool />)

    const remButton = screen.getByRole('button', { name: 'rem' })
    fireEvent.click(remButton)

    const readonlyInputs = document.querySelectorAll('input[readonly]')
    const cssInput = readonlyInputs[0] as HTMLInputElement
    expect(cssInput.value).toContain('rem')
  })

  it('displays individual corner properties', () => {
    render(<BorderRadiusGeneratorTool />)
    expect(screen.getByText('Individual Corner Properties')).toBeInTheDocument()

    const cornerInputs = screen.getAllByRole('textbox')
    const topLeftInput = cornerInputs.find(input =>
      (input as HTMLInputElement).value.includes('border-top-left-radius')
    )
    expect(topLeftInput).toBeDefined()
  })

  it('displays Tailwind class output', () => {
    render(<BorderRadiusGeneratorTool />)
    expect(screen.getByText('Tailwind Class')).toBeInTheDocument()
    const readonlyInputs = document.querySelectorAll('input[readonly]')
    // Tailwind class is the last readonly input
    const tailwindInput = readonlyInputs[readonlyInputs.length - 1] as HTMLInputElement
    expect(tailwindInput.value).toContain('rounded-')
  })

  it('displays preview color control', () => {
    render(<BorderRadiusGeneratorTool />)
    expect(screen.getByText('Preview Color')).toBeInTheDocument()
  })

  it('displays preview size control', () => {
    render(<BorderRadiusGeneratorTool />)
    expect(screen.getByText(/Preview Size:/)).toBeInTheDocument()
  })

  it('applies blob-1 preset for asymmetric corners', () => {
    render(<BorderRadiusGeneratorTool />)

    const blobButton = screen.getByRole('button', { name: 'blob-1' })
    fireEvent.click(blobButton)

    const readonlyInputs = document.querySelectorAll('input[readonly]')
    const cssInput = readonlyInputs[0] as HTMLInputElement
    expect(cssInput.value).toContain('30px')
    expect(cssInput.value).toContain('70px')
  })

  it('applies ticket preset for top-only rounded corners', () => {
    render(<BorderRadiusGeneratorTool />)

    const ticketButton = screen.getByRole('button', { name: 'ticket' })
    fireEvent.click(ticketButton)

    const readonlyInputs = document.querySelectorAll('input[readonly]')
    const cssInput = readonlyInputs[0] as HTMLInputElement
    expect(cssInput.value).toContain('8px')
    expect(cssInput.value).toContain('0px')
  })

  it('generates shorthand CSS when opposite corners are equal', () => {
    render(<BorderRadiusGeneratorTool />)

    // First unlink corners
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    // Apply a preset that has opposite corners equal
    const blobButton = screen.getByRole('button', { name: 'blob-1' })
    fireEvent.click(blobButton)

    const readonlyInputs = document.querySelectorAll('input[readonly]')
    const cssInput = readonlyInputs[0] as HTMLInputElement
    // blob-1 has topLeft=30, topRight=70, bottomRight=30, bottomLeft=70
    // which is 2-value shorthand
    expect(cssInput.value).toBe('border-radius: 30px 70px;')
  })

  it('generates individual Tailwind classes for different corners', () => {
    render(<BorderRadiusGeneratorTool />)

    // Apply blob preset
    const blobButton = screen.getByRole('button', { name: 'blob-1' })
    fireEvent.click(blobButton)

    const readonlyInputs = document.querySelectorAll('input[readonly]')
    // Tailwind class is the last readonly input
    const tailwindInput = readonlyInputs[readonlyInputs.length - 1] as HTMLInputElement
    expect(tailwindInput.value).toContain('rounded-tl-')
    expect(tailwindInput.value).toContain('rounded-tr-')
    expect(tailwindInput.value).toContain('rounded-br-')
    expect(tailwindInput.value).toContain('rounded-bl-')
  })
})
