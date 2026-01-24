import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GradientGeneratorTool } from '../gradient-generator'

describe('GradientGeneratorTool', () => {
  it('renders without crashing', () => {
    render(<GradientGeneratorTool />)
    expect(screen.getByText('Gradient Type')).toBeInTheDocument()
    expect(screen.getByText('Color Stops')).toBeInTheDocument()
    expect(screen.getByText('Gradient Preview')).toBeInTheDocument()
  })

  it('has linear and radial gradient type buttons', () => {
    render(<GradientGeneratorTool />)
    expect(screen.getByRole('button', { name: /linear/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /radial/i })).toBeInTheDocument()
  })

  it('shows angle slider for linear gradient', () => {
    render(<GradientGeneratorTool />)

    // Linear should be selected by default
    expect(screen.getByText(/angle: 90/i)).toBeInTheDocument()
  })

  it('hides angle slider when radial is selected', () => {
    render(<GradientGeneratorTool />)

    const radialButton = screen.getByRole('button', { name: /radial/i })
    fireEvent.click(radialButton)

    expect(screen.queryByText(/angle:/i)).not.toBeInTheDocument()
  })

  it('adds a new color stop when Add Color Stop is clicked', () => {
    render(<GradientGeneratorTool />)

    const addButton = screen.getByRole('button', { name: /add color stop/i })
    fireEvent.click(addButton)

    // Should have 3 color inputs now (default is 2)
    const colorInputs = document.querySelectorAll('input[type="color"]')
    expect(colorInputs.length).toBe(3)
  })

  it('generates random gradient when button is clicked', () => {
    render(<GradientGeneratorTool />)

    const randomButton = screen.getByRole('button', { name: /generate random gradient/i })
    fireEvent.click(randomButton)

    // Gradient should still be displayed
    expect(screen.getByText('Gradient Preview')).toBeInTheDocument()
  })

  it('displays CSS code output', () => {
    render(<GradientGeneratorTool />)
    expect(screen.getByText('CSS Code')).toBeInTheDocument()
    expect(screen.getByText('CSS Property Value')).toBeInTheDocument()
    expect(screen.getByText('Background Image')).toBeInTheDocument()
  })

  it('switches between linear and radial gradients', () => {
    render(<GradientGeneratorTool />)

    // Check linear is active by default
    const linearButton = screen.getByRole('button', { name: /linear/i })
    const radialButton = screen.getByRole('button', { name: /radial/i })

    fireEvent.click(radialButton)

    // Radial should now be active
    const cssOutputs = document.querySelectorAll('input[readonly]')
    const cssValues = Array.from(cssOutputs).map(input => (input as HTMLInputElement).value)
    const hasRadialGradient = cssValues.some(val => val.includes('radial-gradient'))

    expect(hasRadialGradient).toBe(true)
  })

  it('limits color stops to 5 maximum', () => {
    render(<GradientGeneratorTool />)

    const addButton = screen.getByRole('button', { name: /add color stop/i })

    // Add 3 more color stops (to reach 5 total)
    fireEvent.click(addButton)
    fireEvent.click(addButton)
    fireEvent.click(addButton)

    // Add button should be hidden or disabled when at 5
    expect(screen.queryByRole('button', { name: /add color stop/i })).not.toBeInTheDocument()
  })
})
