import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { AsciiArtTool } from '../ascii-art'

// Ensure cleanup after each test
afterEach(() => {
  cleanup()
})

// Helper to get input
const getInput = () => {
  const inputs = screen.getAllByRole('textbox')
  return inputs[0] as HTMLInputElement
}

// Helper to get output textarea (readonly)
const getOutputTextarea = () => {
  const textareas = screen.getAllByRole('textbox')
  return textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement | undefined
}

describe('AsciiArtTool', () => {
  it('renders without crashing', () => {
    render(<AsciiArtTool />)
    expect(screen.getByText('Text Input')).toBeInTheDocument()
    expect(screen.getByText('Font Style')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays correct placeholder', () => {
    render(<AsciiArtTool />)
    const input = getInput()
    expect(input.placeholder).toMatch(/Enter text to convert to ASCII art/)
  })

  it('displays all font style buttons', () => {
    render(<AsciiArtTool />)
    expect(screen.getByRole('button', { name: 'Standard' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Banner' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Doom' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Big' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Slant' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Small' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Script' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mini' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Block' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lean' })).toBeInTheDocument()
  })

  it('generates ASCII art when text is entered', async () => {
    render(<AsciiArtTool />)
    const input = getInput()

    fireEvent.change(input, { target: { value: 'Hi' } })

    await waitFor(() => {
      expect(screen.getByText('ASCII Art Output')).toBeInTheDocument()
      expect(screen.getByText('Preview')).toBeInTheDocument()
    })
  })

  it('shows output textarea with generated art', async () => {
    render(<AsciiArtTool />)
    const input = getInput()

    fireEvent.change(input, { target: { value: 'A' } })

    await waitFor(() => {
      const outputTextarea = getOutputTextarea()
      expect(outputTextarea?.value.length).toBeGreaterThan(0)
    })
  })

  it('changes output when different font is selected', async () => {
    render(<AsciiArtTool />)
    const input = getInput()

    fireEvent.change(input, { target: { value: 'Hi' } })

    await waitFor(() => {
      expect(screen.getByText('ASCII Art Output')).toBeInTheDocument()
    })

    const outputTextarea = getOutputTextarea()
    const standardOutput = outputTextarea?.value

    const doomButton = screen.getByRole('button', { name: 'Doom' })
    fireEvent.click(doomButton)

    await waitFor(() => {
      const newOutputTextarea = getOutputTextarea()
      // Output should change with different font
      expect(newOutputTextarea?.value).not.toBe(standardOutput)
    })
  })

  it('uses Standard font by default', () => {
    render(<AsciiArtTool />)
    const standardButton = screen.getByRole('button', { name: 'Standard' })
    // Check if Standard button has primary variant (selected state)
    expect(standardButton.className).toContain('bg-')
  })

  it('handles empty input gracefully', () => {
    render(<AsciiArtTool />)
    const input = getInput()

    fireEvent.change(input, { target: { value: '' } })

    expect(screen.queryByText('ASCII Art Output')).not.toBeInTheDocument()
    expect(screen.queryByText('Preview')).not.toBeInTheDocument()
  })

  it('resets all fields when reset button is clicked', async () => {
    render(<AsciiArtTool />)
    const input = getInput()

    fireEvent.change(input, { target: { value: 'Test' } })

    await waitFor(() => {
      expect(screen.getByText('ASCII Art Output')).toBeInTheDocument()
    })

    // Change font
    const doomButton = screen.getByRole('button', { name: 'Doom' })
    fireEvent.click(doomButton)

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(input.value).toBe('')
    expect(screen.queryByText('ASCII Art Output')).not.toBeInTheDocument()
  })

  it('shows preview with dark background', async () => {
    render(<AsciiArtTool />)
    const input = getInput()

    fireEvent.change(input, { target: { value: 'Hi' } })

    await waitFor(() => {
      expect(screen.getByText('Preview')).toBeInTheDocument()
      // Check for the preview container with dark background
      const previewContainer = document.querySelector('.bg-\\[\\#1a1a2e\\]')
      expect(previewContainer).toBeTruthy()
    })
  })

  it('generates multi-line ASCII art', async () => {
    render(<AsciiArtTool />)
    const input = getInput()

    fireEvent.change(input, { target: { value: 'Hello' } })

    await waitFor(() => {
      const outputTextarea = getOutputTextarea()
      // ASCII art should have multiple lines
      expect(outputTextarea?.value.split('\n').length).toBeGreaterThan(1)
    })
  })

  it('handles special characters in input', async () => {
    render(<AsciiArtTool />)
    const input = getInput()

    fireEvent.change(input, { target: { value: 'Hi!' } })

    await waitFor(() => {
      expect(screen.getByText('ASCII Art Output')).toBeInTheDocument()
      const outputTextarea = getOutputTextarea()
      expect(outputTextarea?.value.length).toBeGreaterThan(0)
    })
  })

  it('handles numbers in input', async () => {
    render(<AsciiArtTool />)
    const input = getInput()

    fireEvent.change(input, { target: { value: '123' } })

    await waitFor(() => {
      expect(screen.getByText('ASCII Art Output')).toBeInTheDocument()
    })
  })

  it('selects font when button is clicked', async () => {
    render(<AsciiArtTool />)
    const input = getInput()

    fireEvent.change(input, { target: { value: 'Test' } })

    const slantButton = screen.getByRole('button', { name: 'Slant' })
    fireEvent.click(slantButton)

    await waitFor(() => {
      // Slant font produces italic-like output
      const outputTextarea = getOutputTextarea()
      expect(outputTextarea?.value.length).toBeGreaterThan(0)
    })
  })

  it('updates output in real-time as text changes', async () => {
    render(<AsciiArtTool />)
    const input = getInput()

    fireEvent.change(input, { target: { value: 'A' } })

    await waitFor(() => {
      expect(screen.getByText('ASCII Art Output')).toBeInTheDocument()
    })

    const outputTextarea = getOutputTextarea()
    const firstOutput = outputTextarea?.value

    fireEvent.change(input, { target: { value: 'AB' } })

    await waitFor(() => {
      const newOutputTextarea = getOutputTextarea()
      expect(newOutputTextarea?.value).not.toBe(firstOutput)
      expect((newOutputTextarea?.value?.length || 0)).toBeGreaterThan(firstOutput?.length || 0)
    })
  })
})
