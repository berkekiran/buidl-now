import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EpochConverterTool } from '../epoch-converter'

describe('EpochConverterTool', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders without crashing', () => {
    render(<EpochConverterTool />)
    expect(screen.getByText('Convert epoch to human-readable date and vice versa')).toBeInTheDocument()
    expect(screen.getByText('Manual Date Input')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Batch Convert' })).toBeInTheDocument()
  })

  it('displays current epoch time', () => {
    render(<EpochConverterTool />)
    expect(screen.getByText('The current Unix epoch time is')).toBeInTheDocument()
    // Should display the mocked timestamp
    expect(screen.getByText('1705320000')).toBeInTheDocument()
  })

  it('converts timestamp to human readable date', () => {
    render(<EpochConverterTool />)
    const timestampInput = screen.getByPlaceholderText('1761665520')

    fireEvent.change(timestampInput, { target: { value: '1704067200' } })

    expect(screen.getByDisplayValue('2024-01-01T00:00:00.000Z')).toBeInTheDocument()
  })

  it('converts milliseconds timestamp to date', () => {
    render(<EpochConverterTool />)
    const timestampInput = screen.getByPlaceholderText('1761665520')

    // 13-digit timestamp (milliseconds)
    fireEvent.change(timestampInput, { target: { value: '1704067200000' } })

    expect(screen.getByDisplayValue('2024-01-01T00:00:00.000Z')).toBeInTheDocument()
  })

  it('converts human readable date to timestamp', () => {
    render(<EpochConverterTool />)
    const dateInput = screen.getByPlaceholderText('2021-01-01T00:00:00.000Z')

    fireEvent.change(dateInput, { target: { value: '2024-01-01T00:00:00.000Z' } })

    expect(screen.getByDisplayValue('1704067200')).toBeInTheDocument()
  })

  it('handles manual date input conversion', () => {
    render(<EpochConverterTool />)

    const yearInput = screen.getByPlaceholderText('2025')
    const monthInput = screen.getByPlaceholderText('10')
    const dayInput = screen.getByPlaceholderText('28')

    fireEvent.change(yearInput, { target: { value: '2024' } })
    fireEvent.change(monthInput, { target: { value: '1' } })
    fireEvent.change(dayInput, { target: { value: '1' } })

    const convertButton = screen.getByRole('button', { name: 'Human date to Timestamp' })
    fireEvent.click(convertButton)

    // Should have converted the date
    const timestampInput = screen.getByPlaceholderText('1761665520')
    expect(timestampInput).toHaveValue()
  })

  it('handles batch conversion', () => {
    render(<EpochConverterTool />)

    const batchInput = screen.getByPlaceholderText(/1609459200/)
    fireEvent.change(batchInput, { target: { value: '1609459200\n1640995200' } })

    const batchButton = screen.getByRole('button', { name: 'Batch Convert' })
    fireEvent.click(batchButton)

    // Should show results
    expect(screen.getByText('Results')).toBeInTheDocument()
  })

  it('converts seconds to time breakdown', () => {
    render(<EpochConverterTool />)

    const secondsInput = screen.getByPlaceholderText('90061')
    fireEvent.change(secondsInput, { target: { value: '90061' } })

    const convertButton = screen.getByRole('button', { name: 'Seconds to days, hours, minutes' })
    fireEvent.click(convertButton)

    expect(screen.getByDisplayValue('1 days, 1 hours, 1 minutes, 1 seconds')).toBeInTheDocument()
  })

  it('resets fields when reset button is clicked', () => {
    render(<EpochConverterTool />)
    const timestampInput = screen.getByPlaceholderText('1761665520')

    fireEvent.change(timestampInput, { target: { value: '1704067200' } })

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(timestampInput).toHaveValue('')
  })

  it('handles invalid timestamp gracefully', () => {
    render(<EpochConverterTool />)
    const timestampInput = screen.getByPlaceholderText('1761665520')

    fireEvent.change(timestampInput, { target: { value: 'invalid' } })

    // Should not crash and date field should be empty
    const dateInput = screen.getByPlaceholderText('2021-01-01T00:00:00.000Z')
    expect(dateInput).toHaveValue('')
  })
})
