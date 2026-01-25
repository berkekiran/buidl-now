import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FaviconGeneratorTool } from '../favicon-generator'

// Mock canvas context
const mockGetContext = vi.fn(() => ({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  quadraticCurveTo: vi.fn(),
  closePath: vi.fn(),
  fill: vi.fn(),
  fillText: vi.fn(),
  fillStyle: '',
  font: '',
  textAlign: '',
  textBaseline: '',
}))

const mockToDataURL = vi.fn(() => 'data:image/png;base64,mockdata')

beforeEach(() => {
  // Mock HTMLCanvasElement
  HTMLCanvasElement.prototype.getContext = mockGetContext as unknown as typeof HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.toDataURL = mockToDataURL
})

describe('FaviconGeneratorTool', () => {
  it('renders without crashing', () => {
    render(<FaviconGeneratorTool />)
    expect(screen.getByText('Text or Emoji')).toBeInTheDocument()
    expect(screen.getByText('Letter Presets')).toBeInTheDocument()
    expect(screen.getByText('Emoji Presets')).toBeInTheDocument()
    expect(screen.getByText('Color Presets')).toBeInTheDocument()
    expect(screen.getByText('Preview')).toBeInTheDocument()
    expect(screen.getByText('Download')).toBeInTheDocument()
  })

  it('has default text value of B', () => {
    render(<FaviconGeneratorTool />)
    const textInput = screen.getByPlaceholderText(/B or/i)
    expect(textInput).toHaveValue('B')
  })

  it('displays letter preset buttons', () => {
    render(<FaviconGeneratorTool />)
    expect(screen.getByRole('button', { name: 'B' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'X' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'N' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'S' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'D' })).toBeInTheDocument()
  })

  it('displays emoji preset buttons', () => {
    render(<FaviconGeneratorTool />)
    // Check for some emoji presets (these are rendered as button content)
    const buttons = screen.getAllByRole('button')
    const buttonTexts = buttons.map(b => b.textContent)
    expect(buttonTexts).toContain('🚀')
    expect(buttonTexts).toContain('⚡')
    expect(buttonTexts).toContain('🔥')
  })

  it('changes text when letter preset is clicked', () => {
    render(<FaviconGeneratorTool />)

    const aButton = screen.getByRole('button', { name: 'A' })
    fireEvent.click(aButton)

    const textInput = screen.getByPlaceholderText(/B or/i)
    expect(textInput).toHaveValue('A')
  })

  it('changes text when emoji preset is clicked', () => {
    render(<FaviconGeneratorTool />)

    const rocketButton = screen.getByRole('button', { name: '🚀' })
    fireEvent.click(rocketButton)

    const textInput = screen.getByPlaceholderText(/B or/i)
    expect(textInput).toHaveValue('🚀')
  })

  it('allows custom text input', () => {
    render(<FaviconGeneratorTool />)

    const textInput = screen.getByPlaceholderText(/B or/i)
    fireEvent.change(textInput, { target: { value: 'Z' } })

    expect(textInput).toHaveValue('Z')
  })

  it('limits text input to 2 characters', () => {
    render(<FaviconGeneratorTool />)

    const textInput = screen.getByPlaceholderText(/B or/i) as HTMLInputElement
    expect(textInput.maxLength).toBe(2)
  })

  it('displays background and text color controls', () => {
    render(<FaviconGeneratorTool />)
    expect(screen.getByText('Background Color')).toBeInTheDocument()
    expect(screen.getByText('Text Color')).toBeInTheDocument()
  })

  it('displays font family selector', () => {
    render(<FaviconGeneratorTool />)
    expect(screen.getByText('Font Family')).toBeInTheDocument()
    const fontSelect = screen.getByRole('combobox')
    expect(fontSelect).toHaveValue('system-ui')
  })

  it('has font family options', () => {
    render(<FaviconGeneratorTool />)
    expect(screen.getByRole('option', { name: 'System UI' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Arial' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Georgia' })).toBeInTheDocument()
  })

  it('displays font size slider', () => {
    render(<FaviconGeneratorTool />)
    expect(screen.getByText(/Font Size:/)).toBeInTheDocument()
  })

  it('displays border radius slider', () => {
    render(<FaviconGeneratorTool />)
    expect(screen.getByText(/Border Radius:/)).toBeInTheDocument()
  })

  it('displays download buttons for various sizes', () => {
    render(<FaviconGeneratorTool />)

    expect(screen.getByRole('button', { name: '16x16' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '32x32' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '64x64' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '128x128' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '192x192' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '512x512' })).toBeInTheDocument()
  })

  it('displays Base64 Data URL output', () => {
    render(<FaviconGeneratorTool />)
    expect(screen.getByText('Base64 Data URL')).toBeInTheDocument()
  })

  it('displays HTML Link Tag output', () => {
    render(<FaviconGeneratorTool />)
    expect(screen.getByText('HTML Link Tag')).toBeInTheDocument()
    const readonlyInputs = document.querySelectorAll('input[readonly]')
    const htmlInput = readonlyInputs[0] as HTMLInputElement
    expect(htmlInput.value).toContain('<link rel="icon"')
  })

  it('displays color preset buttons', () => {
    render(<FaviconGeneratorTool />)
    // Color preset buttons are styled divs, check by title attribute
    const bluePreset = screen.getByTitle('Blue')
    const greenPreset = screen.getByTitle('Green')
    const redPreset = screen.getByTitle('Red')

    expect(bluePreset).toBeInTheDocument()
    expect(greenPreset).toBeInTheDocument()
    expect(redPreset).toBeInTheDocument()
  })

  it('displays preview section with size labels', () => {
    render(<FaviconGeneratorTool />)
    // There are multiple size labels (preview + download buttons)
    expect(screen.getAllByText('64x64').length).toBeGreaterThan(0)
    expect(screen.getAllByText('32x32').length).toBeGreaterThan(0)
    expect(screen.getAllByText('16x16').length).toBeGreaterThan(0)
  })

  it('displays browser tab preview', () => {
    render(<FaviconGeneratorTool />)
    expect(screen.getByText('Browser tab:')).toBeInTheDocument()
    expect(screen.getByText('My Site')).toBeInTheDocument()
  })

  it('changes font family when option is selected', () => {
    render(<FaviconGeneratorTool />)

    const fontSelect = screen.getByRole('combobox')
    fireEvent.change(fontSelect, { target: { value: 'Arial' } })

    expect(fontSelect).toHaveValue('Arial')
  })

  it('has color input fields', () => {
    render(<FaviconGeneratorTool />)

    const colorInputs = document.querySelectorAll('input[type="color"]')
    expect(colorInputs.length).toBeGreaterThanOrEqual(2)
  })

  it('generates favicon on mount', () => {
    render(<FaviconGeneratorTool />)

    // The canvas toDataURL should have been called
    expect(mockToDataURL).toHaveBeenCalled()
  })
})
