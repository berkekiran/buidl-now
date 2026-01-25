import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CrontabGuruTool } from '../crontab-guru'

describe('CrontabGuruTool', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders without crashing', () => {
    render(<CrontabGuruTool />)
    expect(screen.getByText('Cron Expression')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Parse Expression' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays input placeholder and format hint', () => {
    render(<CrontabGuruTool />)
    expect(screen.getByPlaceholderText('* * * * *')).toBeInTheDocument()
    expect(screen.getByText('Format: minute hour day-of-month month day-of-week')).toBeInTheDocument()
  })

  it('displays common cron expressions section', () => {
    render(<CrontabGuruTool />)
    expect(screen.getByText('Common Cron Expressions')).toBeInTheDocument()
    expect(screen.getByText('Every minute')).toBeInTheDocument()
    expect(screen.getByText('Every 5 minutes')).toBeInTheDocument()
    expect(screen.getByText('Every hour')).toBeInTheDocument()
    expect(screen.getByText('Every day at midnight')).toBeInTheDocument()
  })

  it('displays quick reference section', () => {
    render(<CrontabGuruTool />)
    expect(screen.getByText('Quick Reference')).toBeInTheDocument()
    expect(screen.getByText('any value')).toBeInTheDocument()
    expect(screen.getByText('value list separator')).toBeInTheDocument()
    expect(screen.getByText('range of values')).toBeInTheDocument()
    expect(screen.getByText('step values')).toBeInTheDocument()
  })

  it('parses "every minute" expression', () => {
    render(<CrontabGuruTool />)
    const input = screen.getByPlaceholderText('* * * * *')
    const parseButton = screen.getByRole('button', { name: 'Parse Expression' })

    fireEvent.change(input, { target: { value: '* * * * *' } })
    fireEvent.click(parseButton)

    expect(screen.getByText('Runs every minute')).toBeInTheDocument()
    expect(screen.getByText('Field Breakdown')).toBeInTheDocument()
    expect(screen.getByText('Next 5 Execution Times')).toBeInTheDocument()
  })

  it('parses "every 5 minutes" expression', () => {
    render(<CrontabGuruTool />)
    const input = screen.getByPlaceholderText('* * * * *')
    const parseButton = screen.getByRole('button', { name: 'Parse Expression' })

    fireEvent.change(input, { target: { value: '*/5 * * * *' } })
    fireEvent.click(parseButton)

    expect(screen.getByText('Runs every 5 minutes')).toBeInTheDocument()
  })

  it('parses "every hour" expression', () => {
    render(<CrontabGuruTool />)
    const input = screen.getByPlaceholderText('* * * * *')
    const parseButton = screen.getByRole('button', { name: 'Parse Expression' })

    fireEvent.change(input, { target: { value: '0 * * * *' } })
    fireEvent.click(parseButton)

    expect(screen.getByText('Runs every hour at minute 0')).toBeInTheDocument()
  })

  it('parses specific time expression', () => {
    render(<CrontabGuruTool />)
    const input = screen.getByPlaceholderText('* * * * *')
    const parseButton = screen.getByRole('button', { name: 'Parse Expression' })

    fireEvent.change(input, { target: { value: '30 9 * * *' } })
    fireEvent.click(parseButton)

    expect(screen.getByText(/at 09:30/)).toBeInTheDocument()
  })

  it('shows error for invalid cron expression', () => {
    render(<CrontabGuruTool />)
    const input = screen.getByPlaceholderText('* * * * *')
    const parseButton = screen.getByRole('button', { name: 'Parse Expression' })

    fireEvent.change(input, { target: { value: '* * *' } })
    fireEvent.click(parseButton)

    expect(screen.getByText('Cron expression must have exactly 5 fields (minute hour day month weekday)')).toBeInTheDocument()
  })

  it('displays field breakdown correctly', () => {
    render(<CrontabGuruTool />)
    const input = screen.getByPlaceholderText('* * * * *')
    const parseButton = screen.getByRole('button', { name: 'Parse Expression' })

    fireEvent.change(input, { target: { value: '30 9 15 6 1' } })
    fireEvent.click(parseButton)

    expect(screen.getByText('minute')).toBeInTheDocument()
    expect(screen.getByText('hour')).toBeInTheDocument()
    expect(screen.getByText('day (month)')).toBeInTheDocument()
    expect(screen.getByText('month')).toBeInTheDocument()
    expect(screen.getByText('day (week)')).toBeInTheDocument()
  })

  it('calculates next execution times', () => {
    render(<CrontabGuruTool />)
    const input = screen.getByPlaceholderText('* * * * *')
    const parseButton = screen.getByRole('button', { name: 'Parse Expression' })

    fireEvent.change(input, { target: { value: '* * * * *' } })
    fireEvent.click(parseButton)

    expect(screen.getByText('Next 5 Execution Times')).toBeInTheDocument()
    // Should show numbered list of next runs
    expect(screen.getByText('1.')).toBeInTheDocument()
    expect(screen.getByText('2.')).toBeInTheDocument()
    expect(screen.getByText('3.')).toBeInTheDocument()
  })

  it('resets parsed results when reset button is clicked', () => {
    render(<CrontabGuruTool />)
    const input = screen.getByPlaceholderText('* * * * *')
    const parseButton = screen.getByRole('button', { name: 'Parse Expression' })
    const resetButton = screen.getByRole('button', { name: 'Reset' })

    fireEvent.change(input, { target: { value: '* * * * *' } })
    fireEvent.click(parseButton)
    fireEvent.click(resetButton)

    expect(input).toHaveValue('')
    expect(screen.queryByText('Field Breakdown')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<CrontabGuruTool />)
    const parseButton = screen.getByRole('button', { name: 'Parse Expression' })

    fireEvent.click(parseButton)

    expect(screen.queryByText('Field Breakdown')).not.toBeInTheDocument()
    expect(screen.queryByText(/Cron expression must have/)).not.toBeInTheDocument()
  })

  it('parses example when clicked', () => {
    render(<CrontabGuruTool />)
    const everyHourExample = screen.getByText('Every hour').closest('button')

    if (everyHourExample) {
      fireEvent.click(everyHourExample)
    }

    expect(screen.getByText('Field Breakdown')).toBeInTheDocument()
  })

  it('parses weekday expression', () => {
    render(<CrontabGuruTool />)
    const input = screen.getByPlaceholderText('* * * * *')
    const parseButton = screen.getByRole('button', { name: 'Parse Expression' })

    fireEvent.change(input, { target: { value: '0 9 * * 1-5' } })
    fireEvent.click(parseButton)

    expect(screen.getByText(/Monday through Friday/)).toBeInTheDocument()
  })

  it('parses monthly expression', () => {
    render(<CrontabGuruTool />)
    const input = screen.getByPlaceholderText('* * * * *')
    const parseButton = screen.getByRole('button', { name: 'Parse Expression' })

    fireEvent.change(input, { target: { value: '0 0 1 * *' } })
    fireEvent.click(parseButton)

    expect(screen.getByText(/on day 1 of the month/)).toBeInTheDocument()
  })

  it('parses specific month expression', () => {
    render(<CrontabGuruTool />)
    const input = screen.getByPlaceholderText('* * * * *')
    const parseButton = screen.getByRole('button', { name: 'Parse Expression' })

    fireEvent.change(input, { target: { value: '0 0 1 1 *' } })
    fireEvent.click(parseButton)

    expect(screen.getByText(/in January/)).toBeInTheDocument()
  })

  it('parses expression with Enter key', () => {
    render(<CrontabGuruTool />)
    const input = screen.getByPlaceholderText('* * * * *')

    fireEvent.change(input, { target: { value: '*/15 * * * *' } })
    fireEvent.keyUp(input, { key: 'Enter' })

    expect(screen.getByText('Runs every 15 minutes')).toBeInTheDocument()
  })

  it('parses every 30 minutes expression', () => {
    render(<CrontabGuruTool />)
    const input = screen.getByPlaceholderText('* * * * *')
    const parseButton = screen.getByRole('button', { name: 'Parse Expression' })

    fireEvent.change(input, { target: { value: '*/30 * * * *' } })
    fireEvent.click(parseButton)

    expect(screen.getByText('Runs every 30 minutes')).toBeInTheDocument()
  })

  it('parses Sunday expression', () => {
    render(<CrontabGuruTool />)
    const input = screen.getByPlaceholderText('* * * * *')
    const parseButton = screen.getByRole('button', { name: 'Parse Expression' })

    fireEvent.change(input, { target: { value: '0 0 * * 0' } })
    fireEvent.click(parseButton)

    expect(screen.getByText(/on Sunday/)).toBeInTheDocument()
  })
})
