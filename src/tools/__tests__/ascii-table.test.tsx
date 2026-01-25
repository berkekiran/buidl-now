import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AsciiTableTool } from '../ascii-table'

describe('AsciiTableTool', () => {
  it('renders without crashing', () => {
    render(<AsciiTableTool />)
    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('Filter by Range (Decimal)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All (128)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Printable (95)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Control (33)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays ASCII table headers', () => {
    render(<AsciiTableTool />)
    expect(screen.getByRole('columnheader', { name: 'Dec' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Hex' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Oct' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Binary' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Char' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Description' })).toBeInTheDocument()
  })

  it('displays all 128 characters by default', () => {
    render(<AsciiTableTool />)
    expect(screen.getByText(/Showing 128 of 128 characters/)).toBeInTheDocument()
  })

  it('filters to printable characters', () => {
    render(<AsciiTableTool />)
    const printableButton = screen.getByRole('button', { name: 'Printable (95)' })

    fireEvent.click(printableButton)

    expect(screen.getByText(/Showing 95 of 128 characters/)).toBeInTheDocument()
  })

  it('filters to control characters', () => {
    render(<AsciiTableTool />)
    const controlButton = screen.getByRole('button', { name: 'Control (33)' })

    fireEvent.click(controlButton)

    expect(screen.getByText(/Showing 33 of 128 characters/)).toBeInTheDocument()
  })

  it('searches by decimal value', () => {
    render(<AsciiTableTool />)
    const searchInput = screen.getByPlaceholderText('Search by decimal, hex, character, or description...')

    fireEvent.change(searchInput, { target: { value: '65' } })

    // Should show character A (decimal 65)
    expect(screen.getAllByText('A').length).toBeGreaterThan(0)
  })

  it('searches by hex value', () => {
    render(<AsciiTableTool />)
    const searchInput = screen.getByPlaceholderText('Search by decimal, hex, character, or description...')

    fireEvent.change(searchInput, { target: { value: '41' } })

    // 0x41 is decimal 65, which is 'A'
    expect(screen.getAllByText('A').length).toBeGreaterThan(0)
  })

  it('searches by character', () => {
    render(<AsciiTableTool />)
    const searchInput = screen.getByPlaceholderText('Search by decimal, hex, character, or description...')

    fireEvent.change(searchInput, { target: { value: 'A' } })

    expect(screen.getAllByText('65').length).toBeGreaterThan(0)
  })

  it('searches by description', () => {
    render(<AsciiTableTool />)
    const searchInput = screen.getByPlaceholderText('Search by decimal, hex, character, or description...')

    fireEvent.change(searchInput, { target: { value: 'Carriage Return' } })

    expect(screen.getAllByText('13').length).toBeGreaterThan(0)
    expect(screen.getAllByText('CR (Carriage Return)').length).toBeGreaterThan(0)
  })

  it('filters by decimal range', () => {
    render(<AsciiTableTool />)
    const startInput = screen.getByPlaceholderText('Start (0)')
    const endInput = screen.getByPlaceholderText('End (127)')

    fireEvent.change(startInput, { target: { value: '65' } })
    fireEvent.change(endInput, { target: { value: '70' } })

    expect(screen.getByText(/Showing 6 of 128 characters/)).toBeInTheDocument()
    expect(screen.getAllByText('A').length).toBeGreaterThan(0)
    expect(screen.getAllByText('F').length).toBeGreaterThan(0)
  })

  it('resets all filters when reset button is clicked', () => {
    render(<AsciiTableTool />)
    const searchInput = screen.getByPlaceholderText('Search by decimal, hex, character, or description...')
    const controlButton = screen.getByRole('button', { name: 'Control (33)' })
    const resetButton = screen.getByRole('button', { name: 'Reset' })

    fireEvent.change(searchInput, { target: { value: 'test' } })
    fireEvent.click(controlButton)
    fireEvent.click(resetButton)

    expect(searchInput).toHaveValue('')
    expect(screen.getByText(/Showing 128 of 128 characters/)).toBeInTheDocument()
  })

  it('shows no results message when search has no matches', () => {
    render(<AsciiTableTool />)
    const searchInput = screen.getByPlaceholderText('Search by decimal, hex, character, or description...')

    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })

    expect(screen.getByText('No characters match your search criteria')).toBeInTheDocument()
  })

  it('displays control character names', () => {
    render(<AsciiTableTool />)
    const controlButton = screen.getByRole('button', { name: 'Control (33)' })

    fireEvent.click(controlButton)

    expect(screen.getAllByText('NUL (Null)').length).toBeGreaterThan(0)
    expect(screen.getAllByText('LF (Line Feed)').length).toBeGreaterThan(0)
  })

  it('displays binary representation', () => {
    render(<AsciiTableTool />)
    const searchInput = screen.getByPlaceholderText('Search by decimal, hex, character, or description...')

    fireEvent.change(searchInput, { target: { value: '65' } })

    // Binary of 65 is 01000001
    expect(screen.getAllByText('01000001').length).toBeGreaterThan(0)
  })

  it('displays octal representation', () => {
    render(<AsciiTableTool />)
    const searchInput = screen.getByPlaceholderText('Search by decimal, hex, character, or description...')

    fireEvent.change(searchInput, { target: { value: '65' } })

    // Octal of 65 is 101
    expect(screen.getAllByText('101').length).toBeGreaterThan(0)
  })

  it('displays hex with 0x prefix', () => {
    render(<AsciiTableTool />)
    const searchInput = screen.getByPlaceholderText('Search by decimal, hex, character, or description...')

    fireEvent.change(searchInput, { target: { value: '65' } })

    // Hex of 65 is 0x41
    expect(screen.getAllByText('0x41').length).toBeGreaterThan(0)
  })

  it('shows space character with special symbol', () => {
    render(<AsciiTableTool />)
    const searchInput = screen.getByPlaceholderText('Search by decimal, hex, character, or description...')

    fireEvent.change(searchInput, { target: { value: '32' } })

    // Space is shown as special character
    expect(screen.getAllByText('Space').length).toBeGreaterThan(0)
  })
})
