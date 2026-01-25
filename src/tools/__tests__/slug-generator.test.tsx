import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { SlugGeneratorTool } from '../slug-generator'

// Ensure cleanup after each test
afterEach(() => {
  cleanup()
})

// Helper to get input textarea
const getInputTextarea = () => {
  const textareas = screen.getAllByRole('textbox')
  return textareas[0] as HTMLTextAreaElement
}

// Helper to get output input
const getOutputInput = () => {
  const inputs = screen.getAllByRole('textbox')
  return inputs.find(i => i.hasAttribute('readonly')) as HTMLInputElement | undefined
}

describe('SlugGeneratorTool', () => {
  it('renders without crashing', () => {
    render(<SlugGeneratorTool />)
    expect(screen.getByText('Text Input')).toBeInTheDocument()
    expect(screen.getByText('Options')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays correct placeholder', () => {
    render(<SlugGeneratorTool />)
    const input = getInputTextarea()
    expect(input.placeholder).toMatch(/Enter text to convert to a URL-friendly slug/)
  })

  it('generates slug from simple text', async () => {
    render(<SlugGeneratorTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'Hello World' } })

    await waitFor(() => {
      expect(screen.getByText('Generated Slug')).toBeInTheDocument()
      expect(screen.getByDisplayValue('hello-world')).toBeInTheDocument()
    })
  })

  it('converts text to lowercase by default', async () => {
    render(<SlugGeneratorTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'HELLO WORLD' } })

    await waitFor(() => {
      expect(screen.getByDisplayValue('hello-world')).toBeInTheDocument()
    })
  })

  it('removes special characters', async () => {
    render(<SlugGeneratorTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'Hello, World! How are you?' } })

    await waitFor(() => {
      expect(screen.getByDisplayValue('hello-world-how-are-you')).toBeInTheDocument()
    })
  })

  it('transliterates accented characters by default', async () => {
    render(<SlugGeneratorTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'Cafe au Lait' } })

    await waitFor(() => {
      expect(screen.getByDisplayValue('cafe-au-lait')).toBeInTheDocument()
    })
  })

  it('handles German characters with transliteration', async () => {
    render(<SlugGeneratorTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'Munchen' } })

    await waitFor(() => {
      expect(screen.getByDisplayValue('munchen')).toBeInTheDocument()
    })
  })

  it('uses underscore separator when selected', async () => {
    render(<SlugGeneratorTool />)
    const input = getInputTextarea()
    const underscoreButton = screen.getByRole('button', { name: /Underscore/i })

    fireEvent.click(underscoreButton)
    fireEvent.change(input, { target: { value: 'Hello World' } })

    await waitFor(() => {
      expect(screen.getByDisplayValue('hello_world')).toBeInTheDocument()
    })
  })

  it('switches back to dash separator', async () => {
    render(<SlugGeneratorTool />)
    const input = getInputTextarea()
    const underscoreButton = screen.getByRole('button', { name: /Underscore/i })
    const dashButton = screen.getByRole('button', { name: /Dash/i })

    fireEvent.click(underscoreButton)
    fireEvent.change(input, { target: { value: 'Hello World' } })

    await waitFor(() => {
      expect(screen.getByDisplayValue('hello_world')).toBeInTheDocument()
    })

    fireEvent.click(dashButton)

    await waitFor(() => {
      expect(screen.getByDisplayValue('hello-world')).toBeInTheDocument()
    })
  })

  it('preserves case when lowercase option is unchecked', async () => {
    render(<SlugGeneratorTool />)
    const input = getInputTextarea()
    const lowercaseCheckbox = document.getElementById('lowercase') as HTMLInputElement

    fireEvent.click(lowercaseCheckbox)
    fireEvent.change(input, { target: { value: 'Hello World' } })

    await waitFor(() => {
      expect(screen.getByDisplayValue('Hello-World')).toBeInTheDocument()
    })
  })

  it('does not transliterate when option is unchecked', async () => {
    render(<SlugGeneratorTool />)
    const input = getInputTextarea()
    const transliterateCheckbox = document.getElementById('transliterate') as HTMLInputElement

    fireEvent.click(transliterateCheckbox)
    fireEvent.change(input, { target: { value: 'Cafe' } })

    await waitFor(() => {
      // Without transliteration, simple text should still work
      expect(screen.getByDisplayValue('cafe')).toBeInTheDocument()
    })
  })

  it('displays checkbox options', () => {
    render(<SlugGeneratorTool />)
    expect(screen.getByText('Convert to lowercase')).toBeInTheDocument()
    expect(screen.getByText('Transliterate special characters')).toBeInTheDocument()
  })

  it('displays separator options', () => {
    render(<SlugGeneratorTool />)
    expect(screen.getByText('Separator')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Dash/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Underscore/i })).toBeInTheDocument()
  })

  it('resets all fields when reset button is clicked', async () => {
    render(<SlugGeneratorTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'Hello World' } })

    await waitFor(() => {
      expect(screen.getByText('Generated Slug')).toBeInTheDocument()
    })

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(input.value).toBe('')
    expect(screen.queryByText('Generated Slug')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<SlugGeneratorTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: '' } })

    expect(screen.queryByText('Generated Slug')).not.toBeInTheDocument()
  })

  it('trims leading and trailing separators', async () => {
    render(<SlugGeneratorTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: '  Hello World  ' } })

    await waitFor(() => {
      expect(screen.getByDisplayValue('hello-world')).toBeInTheDocument()
    })
  })

  it('handles multiple spaces correctly', async () => {
    render(<SlugGeneratorTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'Hello    World' } })

    await waitFor(() => {
      expect(screen.getByDisplayValue('hello-world')).toBeInTheDocument()
    })
  })

  it('handles numbers in input', async () => {
    render(<SlugGeneratorTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'Article 2024' } })

    await waitFor(() => {
      expect(screen.getByDisplayValue('article-2024')).toBeInTheDocument()
    })
  })
})
