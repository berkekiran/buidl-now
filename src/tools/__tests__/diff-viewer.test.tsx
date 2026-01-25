import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DiffViewerTool } from '../diff-viewer'

describe('DiffViewerTool', () => {
  it('renders without crashing', () => {
    render(<DiffViewerTool />)
    expect(screen.getByText('Original Text')).toBeInTheDocument()
    expect(screen.getByText('Modified Text')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Compare' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Swap' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays diff mode buttons', () => {
    render(<DiffViewerTool />)
    expect(screen.getByRole('button', { name: 'Line by Line' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Word by Word' })).toBeInTheDocument()
  })

  it('computes line diff when texts differ', () => {
    render(<DiffViewerTool />)
    const original = screen.getByPlaceholderText('Enter original text...')
    const modified = screen.getByPlaceholderText('Enter modified text...')
    const compareButton = screen.getByRole('button', { name: 'Compare' })

    fireEvent.change(original, { target: { value: 'line one\nline two' } })
    fireEvent.change(modified, { target: { value: 'line one\nline three' } })
    fireEvent.click(compareButton)

    expect(screen.getByText('Statistics')).toBeInTheDocument()
    expect(screen.getByText('Differences')).toBeInTheDocument()
  })

  it('shows statistics after comparison', () => {
    render(<DiffViewerTool />)
    const original = screen.getByPlaceholderText('Enter original text...')
    const modified = screen.getByPlaceholderText('Enter modified text...')
    const compareButton = screen.getByRole('button', { name: 'Compare' })

    fireEvent.change(original, { target: { value: 'hello' } })
    fireEvent.change(modified, { target: { value: 'hello\nworld' } })
    fireEvent.click(compareButton)

    expect(screen.getByText('+ Additions:')).toBeInTheDocument()
    expect(screen.getByText('- Deletions:')).toBeInTheDocument()
    expect(screen.getByText('Unchanged:')).toBeInTheDocument()
  })

  it('switches to word diff mode', () => {
    render(<DiffViewerTool />)
    const wordButton = screen.getByRole('button', { name: 'Word by Word' })
    fireEvent.click(wordButton)

    const original = screen.getByPlaceholderText('Enter original text...')
    const modified = screen.getByPlaceholderText('Enter modified text...')
    const compareButton = screen.getByRole('button', { name: 'Compare' })

    fireEvent.change(original, { target: { value: 'hello world' } })
    fireEvent.change(modified, { target: { value: 'hello there' } })
    fireEvent.click(compareButton)

    expect(screen.getByText('Statistics')).toBeInTheDocument()
    expect(screen.getByText('Differences')).toBeInTheDocument()
  })

  it('swaps text inputs when swap button is clicked', () => {
    render(<DiffViewerTool />)
    const original = screen.getByPlaceholderText('Enter original text...')
    const modified = screen.getByPlaceholderText('Enter modified text...')
    const swapButton = screen.getByRole('button', { name: 'Swap' })

    fireEvent.change(original, { target: { value: 'text A' } })
    fireEvent.change(modified, { target: { value: 'text B' } })
    fireEvent.click(swapButton)

    expect(original).toHaveValue('text B')
    expect(modified).toHaveValue('text A')
  })

  it('resets all fields when reset button is clicked', () => {
    render(<DiffViewerTool />)
    const original = screen.getByPlaceholderText('Enter original text...')
    const modified = screen.getByPlaceholderText('Enter modified text...')
    const compareButton = screen.getByRole('button', { name: 'Compare' })
    const resetButton = screen.getByRole('button', { name: 'Reset' })

    fireEvent.change(original, { target: { value: 'text A' } })
    fireEvent.change(modified, { target: { value: 'text B' } })
    fireEvent.click(compareButton)
    fireEvent.click(resetButton)

    expect(original).toHaveValue('')
    expect(modified).toHaveValue('')
    expect(screen.queryByText('Statistics')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<DiffViewerTool />)
    const compareButton = screen.getByRole('button', { name: 'Compare' })

    fireEvent.click(compareButton)

    expect(screen.queryByText('Statistics')).not.toBeInTheDocument()
    expect(screen.queryByText('Differences')).not.toBeInTheDocument()
  })

  it('handles identical texts', () => {
    render(<DiffViewerTool />)
    const original = screen.getByPlaceholderText('Enter original text...')
    const modified = screen.getByPlaceholderText('Enter modified text...')
    const compareButton = screen.getByRole('button', { name: 'Compare' })

    fireEvent.change(original, { target: { value: 'same text' } })
    fireEvent.change(modified, { target: { value: 'same text' } })
    fireEvent.click(compareButton)

    expect(screen.getByText('Statistics')).toBeInTheDocument()
  })

  it('detects additions correctly', () => {
    render(<DiffViewerTool />)
    const original = screen.getByPlaceholderText('Enter original text...')
    const modified = screen.getByPlaceholderText('Enter modified text...')
    const compareButton = screen.getByRole('button', { name: 'Compare' })

    fireEvent.change(original, { target: { value: 'line one' } })
    fireEvent.change(modified, { target: { value: 'line one\nline two' } })
    fireEvent.click(compareButton)

    // Check that additions are tracked
    const additionsText = screen.getByText('+ Additions:')
    expect(additionsText).toBeInTheDocument()
  })

  it('detects deletions correctly', () => {
    render(<DiffViewerTool />)
    const original = screen.getByPlaceholderText('Enter original text...')
    const modified = screen.getByPlaceholderText('Enter modified text...')
    const compareButton = screen.getByRole('button', { name: 'Compare' })

    fireEvent.change(original, { target: { value: 'line one\nline two' } })
    fireEvent.change(modified, { target: { value: 'line one' } })
    fireEvent.click(compareButton)

    // Check that deletions are tracked
    const deletionsText = screen.getByText('- Deletions:')
    expect(deletionsText).toBeInTheDocument()
  })

  it('handles multiline text comparison', () => {
    render(<DiffViewerTool />)
    const original = screen.getByPlaceholderText('Enter original text...')
    const modified = screen.getByPlaceholderText('Enter modified text...')
    const compareButton = screen.getByRole('button', { name: 'Compare' })

    const originalText = `function hello() {
  console.log("Hello");
}`
    const modifiedText = `function hello() {
  console.log("Hello, World!");
  return true;
}`

    fireEvent.change(original, { target: { value: originalText } })
    fireEvent.change(modified, { target: { value: modifiedText } })
    fireEvent.click(compareButton)

    expect(screen.getByText('Differences')).toBeInTheDocument()
    expect(screen.getByText('Statistics')).toBeInTheDocument()
  })
})
