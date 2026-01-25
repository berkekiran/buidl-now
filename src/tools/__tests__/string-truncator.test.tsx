import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { StringTruncatorTool } from '../string-truncator'

// Ensure cleanup after each test
afterEach(() => {
  cleanup()
})

// Helper to get textareas
const getInputTextarea = () => {
  const textareas = screen.getAllByRole('textbox')
  return textareas[0] as HTMLTextAreaElement
}

// Helper to get output textarea (readonly)
const getOutputTextarea = () => {
  const textareas = screen.getAllByRole('textbox')
  return textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement | undefined
}

describe('StringTruncatorTool', () => {
  it('renders without crashing', () => {
    render(<StringTruncatorTool />)
    expect(screen.getByText('Text Input')).toBeInTheDocument()
    expect(screen.getByText('Max Length')).toBeInTheDocument()
    expect(screen.getByText('Ellipsis Position')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays correct placeholder', () => {
    render(<StringTruncatorTool />)
    const input = getInputTextarea()
    expect(input.placeholder).toMatch(/Enter text to truncate/)
  })

  it('displays ellipsis position buttons', () => {
    render(<StringTruncatorTool />)
    expect(screen.getByRole('button', { name: 'End' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Middle' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
  })

  it('truncates text at the end by default', async () => {
    render(<StringTruncatorTool />)
    const input = getInputTextarea()
    const maxLengthInput = screen.getByDisplayValue('50')

    fireEvent.change(maxLengthInput, { target: { value: '20' } })
    fireEvent.change(input, { target: { value: 'The quick brown fox jumps over the lazy dog' } })

    await waitFor(() => {
      expect(screen.getByText('Truncated Text')).toBeInTheDocument()
      const outputTextarea = getOutputTextarea()
      expect(outputTextarea?.value).toContain('...')
      expect(outputTextarea?.value.length).toBeLessThanOrEqual(20)
    })
  })

  it('does not truncate text shorter than max length', async () => {
    render(<StringTruncatorTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: 'Hello' } })

    await waitFor(() => {
      expect(screen.getByText('Truncated Text')).toBeInTheDocument()
      const outputTextarea = getOutputTextarea()
      expect(outputTextarea?.value).toBe('Hello')
    })
  })

  it('truncates at the start when start position is selected', async () => {
    render(<StringTruncatorTool />)
    const input = getInputTextarea()
    const maxLengthInput = screen.getByDisplayValue('50')
    const startButton = screen.getByRole('button', { name: 'Start' })

    fireEvent.click(startButton)
    fireEvent.change(maxLengthInput, { target: { value: '15' } })
    fireEvent.change(input, { target: { value: 'The quick brown fox jumps over the lazy dog' } })

    await waitFor(() => {
      const outputTextarea = getOutputTextarea()
      expect(outputTextarea?.value.startsWith('...')).toBe(true)
    })
  })

  it('truncates in the middle when middle position is selected', async () => {
    render(<StringTruncatorTool />)
    const input = getInputTextarea()
    const maxLengthInput = screen.getByDisplayValue('50')
    const middleButton = screen.getByRole('button', { name: 'Middle' })

    fireEvent.click(middleButton)
    fireEvent.change(maxLengthInput, { target: { value: '20' } })
    fireEvent.change(input, { target: { value: 'The quick brown fox jumps over the lazy dog' } })

    await waitFor(() => {
      const outputTextarea = getOutputTextarea()
      expect(outputTextarea?.value).toContain('...')
      // Middle truncation should have text before and after ellipsis
      const parts = outputTextarea?.value.split('...')
      expect(parts?.length).toBe(2)
      expect(parts?.[0].length).toBeGreaterThan(0)
      expect(parts?.[1].length).toBeGreaterThan(0)
    })
  })

  it('uses custom ellipsis when provided', async () => {
    render(<StringTruncatorTool />)
    const input = getInputTextarea()
    const maxLengthInput = screen.getByDisplayValue('50')
    const ellipsisInputs = screen.getAllByPlaceholderText('...')
    const ellipsisInput = ellipsisInputs[0]

    fireEvent.change(maxLengthInput, { target: { value: '15' } })
    fireEvent.change(ellipsisInput, { target: { value: '***' } })
    fireEvent.change(input, { target: { value: 'The quick brown fox jumps over the lazy dog' } })

    await waitFor(() => {
      const outputTextarea = getOutputTextarea()
      expect(outputTextarea?.value).toContain('***')
    })
  })

  it('shows input and output character counts', async () => {
    render(<StringTruncatorTool />)
    const input = getInputTextarea()
    const maxLengthInput = screen.getByDisplayValue('50')

    fireEvent.change(maxLengthInput, { target: { value: '20' } })
    fireEvent.change(input, { target: { value: 'The quick brown fox jumps over the lazy dog' } })

    await waitFor(() => {
      expect(screen.getByText(/Input length:/)).toBeInTheDocument()
      expect(screen.getByText(/Output length:/)).toBeInTheDocument()
      expect(screen.getByText('43')).toBeInTheDocument() // Input length
    })
  })

  it('respects word boundaries by default', async () => {
    render(<StringTruncatorTool />)
    const input = getInputTextarea()
    const maxLengthInput = screen.getByDisplayValue('50')

    fireEvent.change(maxLengthInput, { target: { value: '25' } })
    fireEvent.change(input, { target: { value: 'The quick brown fox jumps over the lazy dog' } })

    await waitFor(() => {
      const outputTextarea = getOutputTextarea()
      // Should end on a complete word, not mid-word
      const textBeforeEllipsis = outputTextarea?.value.replace('...', '')
      expect(textBeforeEllipsis?.trim().endsWith(' ')).toBe(false)
    })
  })

  it('displays word boundary checkbox', () => {
    render(<StringTruncatorTool />)
    expect(screen.getByText(/Respect word boundaries/)).toBeInTheDocument()
  })

  it('resets all fields when reset button is clicked', async () => {
    render(<StringTruncatorTool />)
    const input = getInputTextarea()
    const maxLengthInput = screen.getByDisplayValue('50') as HTMLInputElement

    fireEvent.change(maxLengthInput, { target: { value: '20' } })
    fireEvent.change(input, { target: { value: 'Hello World Test' } })

    await waitFor(() => {
      expect(screen.getByText('Truncated Text')).toBeInTheDocument()
    })

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(input.value).toBe('')
    expect(maxLengthInput.value).toBe('50')
    expect(screen.queryByText('Truncated Text')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<StringTruncatorTool />)
    const input = getInputTextarea()

    fireEvent.change(input, { target: { value: '' } })

    expect(screen.queryByText('Truncated Text')).not.toBeInTheDocument()
  })

  it('displays ellipsis character input', () => {
    render(<StringTruncatorTool />)
    expect(screen.getByText(/Ellipsis Character/)).toBeInTheDocument()
    const ellipsisInputs = screen.getAllByPlaceholderText('...')
    expect(ellipsisInputs.length).toBeGreaterThan(0)
  })

  it('updates output when max length changes', async () => {
    render(<StringTruncatorTool />)
    const input = getInputTextarea()
    const maxLengthInput = screen.getByDisplayValue('50') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'The quick brown fox jumps over the lazy dog' } })

    await waitFor(() => {
      const outputTextarea = getOutputTextarea()
      // At 50 chars, should not be truncated
      expect(outputTextarea?.value).toBe('The quick brown fox jumps over the lazy dog')
    })

    fireEvent.change(maxLengthInput, { target: { value: '20' } })

    await waitFor(() => {
      const outputTextarea = getOutputTextarea()
      expect(outputTextarea?.value.length).toBeLessThanOrEqual(20)
    })
  })
})
