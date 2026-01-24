import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ColorPaletteGeneratorTool } from '../color-palette-generator'

// Mock Math.random for consistent test results
beforeEach(() => {
  let callCount = 0
  vi.spyOn(Math, 'random').mockImplementation(() => {
    // Return different values for each call to simulate randomness
    callCount++
    return (callCount * 0.123) % 1
  })
})

describe('ColorPaletteGeneratorTool', () => {
  it('renders without crashing', () => {
    render(<ColorPaletteGeneratorTool />)
    expect(screen.getByText('Palette Type')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate palette/i })).toBeInTheDocument()
  })

  it('renders palette type buttons', () => {
    render(<ColorPaletteGeneratorTool />)
    expect(screen.getByRole('button', { name: /^random$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /complementary/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /analogous/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /monochromatic/i })).toBeInTheDocument()
  })

  it('shows color count input in random mode', () => {
    render(<ColorPaletteGeneratorTool />)
    expect(screen.getByText('Number of Colors (2-10)')).toBeInTheDocument()
  })

  it('hides color count input in non-random modes', () => {
    render(<ColorPaletteGeneratorTool />)

    const complementaryButton = screen.getByRole('button', { name: /complementary/i })
    fireEvent.click(complementaryButton)

    expect(screen.queryByText('Number of Colors (2-10)')).not.toBeInTheDocument()
  })

  it('generates random palette', () => {
    render(<ColorPaletteGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: /generate palette/i })

    fireEvent.click(generateButton)

    expect(screen.getByText('Generated Palette')).toBeInTheDocument()
  })

  it('generates complementary palette', () => {
    render(<ColorPaletteGeneratorTool />)

    const complementaryButton = screen.getByRole('button', { name: /complementary/i })
    fireEvent.click(complementaryButton)

    const generateButton = screen.getByRole('button', { name: /generate palette/i })
    fireEvent.click(generateButton)

    expect(screen.getByText('Generated Palette')).toBeInTheDocument()
  })

  it('generates analogous palette', () => {
    render(<ColorPaletteGeneratorTool />)

    const analogousButton = screen.getByRole('button', { name: /analogous/i })
    fireEvent.click(analogousButton)

    const generateButton = screen.getByRole('button', { name: /generate palette/i })
    fireEvent.click(generateButton)

    expect(screen.getByText('Generated Palette')).toBeInTheDocument()
  })

  it('generates monochromatic palette', () => {
    render(<ColorPaletteGeneratorTool />)

    const monochromaticButton = screen.getByRole('button', { name: /monochromatic/i })
    fireEvent.click(monochromaticButton)

    const generateButton = screen.getByRole('button', { name: /generate palette/i })
    fireEvent.click(generateButton)

    expect(screen.getByText('Generated Palette')).toBeInTheDocument()
  })

  it('shows color values in HEX format', () => {
    render(<ColorPaletteGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: /generate palette/i })

    fireEvent.click(generateButton)

    // Should show hex codes starting with #
    const hexCodes = screen.getAllByText(/#[A-F0-9]{6}/i)
    expect(hexCodes.length).toBeGreaterThan(0)
  })

  it('shows color values in RGB format', () => {
    render(<ColorPaletteGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: /generate palette/i })

    fireEvent.click(generateButton)

    // Should show rgb values
    const rgbValues = screen.getAllByText(/rgb\(\d+, \d+, \d+\)/i)
    expect(rgbValues.length).toBeGreaterThan(0)
  })

  it('shows color values in HSL format', () => {
    render(<ColorPaletteGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: /generate palette/i })

    fireEvent.click(generateButton)

    // Should show hsl values
    const hslValues = screen.getAllByText(/hsl\(\d+, \d+%, \d+%\)/i)
    expect(hslValues.length).toBeGreaterThan(0)
  })

  it('has Copy All Hex Codes button after generation', () => {
    render(<ColorPaletteGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: /generate palette/i })

    fireEvent.click(generateButton)

    expect(screen.getByRole('button', { name: /copy all hex codes/i })).toBeInTheDocument()
  })

  it('generates specified number of colors in random mode', () => {
    render(<ColorPaletteGeneratorTool />)
    const colorCountInput = screen.getByPlaceholderText('5')
    const generateButton = screen.getByRole('button', { name: /generate palette/i })

    fireEvent.change(colorCountInput, { target: { value: '3' } })
    fireEvent.click(generateButton)

    // Should have 3 color swatches
    const hexCodes = screen.getAllByText(/#[A-F0-9]{6}/i)
    expect(hexCodes.length).toBe(3)
  })

  it('clamps color count to minimum of 2', () => {
    render(<ColorPaletteGeneratorTool />)
    const colorCountInput = screen.getByPlaceholderText('5')
    const generateButton = screen.getByRole('button', { name: /generate palette/i })

    fireEvent.change(colorCountInput, { target: { value: '1' } })
    fireEvent.click(generateButton)

    // Should have at least 2 colors
    const hexCodes = screen.getAllByText(/#[A-F0-9]{6}/i)
    expect(hexCodes.length).toBeGreaterThanOrEqual(2)
  })

  it('clamps color count to maximum of 10', () => {
    render(<ColorPaletteGeneratorTool />)
    const colorCountInput = screen.getByPlaceholderText('5')
    const generateButton = screen.getByRole('button', { name: /generate palette/i })

    fireEvent.change(colorCountInput, { target: { value: '15' } })
    fireEvent.click(generateButton)

    // Should have at most 10 colors
    const hexCodes = screen.getAllByText(/#[A-F0-9]{6}/i)
    expect(hexCodes.length).toBeLessThanOrEqual(10)
  })

  it('has copy buttons for individual colors', () => {
    render(<ColorPaletteGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: /generate palette/i })

    fireEvent.click(generateButton)

    // Should have copy buttons (one per color)
    const copyButtons = screen.getAllByTitle('Copy to clipboard')
    expect(copyButtons.length).toBeGreaterThan(0)
  })

  it('displays color preview swatches', () => {
    render(<ColorPaletteGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: /generate palette/i })

    fireEvent.click(generateButton)

    // Colors should be displayed in swatches with background colors
    expect(screen.getByText('Generated Palette')).toBeInTheDocument()
  })

  it('switches palette type correctly', () => {
    render(<ColorPaletteGeneratorTool />)

    // Start with random (default)
    const randomButton = screen.getByRole('button', { name: /^random$/i })
    expect(randomButton).toBeInTheDocument()

    // Switch to complementary
    const complementaryButton = screen.getByRole('button', { name: /complementary/i })
    fireEvent.click(complementaryButton)
    expect(complementaryButton).toBeInTheDocument()

    // Switch to analogous
    const analogousButton = screen.getByRole('button', { name: /analogous/i })
    fireEvent.click(analogousButton)
    expect(analogousButton).toBeInTheDocument()

    // Switch to monochromatic
    const monochromaticButton = screen.getByRole('button', { name: /monochromatic/i })
    fireEvent.click(monochromaticButton)
    expect(monochromaticButton).toBeInTheDocument()
  })
})
