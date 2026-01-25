import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { CronParserTool } from '../cron-parser'

// Ensure cleanup after each test
afterEach(() => {
  cleanup()
})

// Helper to get input
const getInputs = () => {
  const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
  // First input is usually the cron expression
  return {
    cronInput: document.querySelector('input[placeholder="*/5 * * * *"]') as HTMLInputElement
  }
}

// Helper to get output textarea (readonly)
const getOutputTextarea = () => {
  const textareas = screen.getAllByRole('textbox')
  return textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
}

describe('CronParserTool', () => {
  it('renders without crashing', () => {
    render(<CronParserTool />)
    expect(screen.getByText('Cron Expression')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Parse Expression/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays placeholder for cron input', () => {
    render(<CronParserTool />)
    const { cronInput } = getInputs()
    expect(cronInput).toBeTruthy()
    expect(cronInput.placeholder).toBe('*/5 * * * *')
  })

  it('displays common presets', () => {
    render(<CronParserTool />)
    expect(screen.getByRole('button', { name: 'Every minute' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Every 5 minutes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Every hour' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Every day at midnight' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Every Monday at 9am' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Every month on 1st' })).toBeInTheDocument()
  })

  it('sets expression when preset is clicked', () => {
    render(<CronParserTool />)
    const preset = screen.getByRole('button', { name: 'Every 5 minutes' })

    fireEvent.click(preset)

    const { cronInput } = getInputs()
    expect(cronInput.value).toBe('*/5 * * * *')
  })

  it('parses valid cron expression and shows next executions', () => {
    render(<CronParserTool />)
    const { cronInput } = getInputs()
    const parseButton = screen.getByRole('button', { name: /Parse Expression/i })

    fireEvent.change(cronInput, { target: { value: '0 * * * *' } })
    fireEvent.click(parseButton)

    expect(screen.getByText('Next Execution Times (UTC)')).toBeInTheDocument()
    expect(screen.getByText('Human-readable description')).toBeInTheDocument()
  })

  it('shows human-readable description for every minute', () => {
    render(<CronParserTool />)
    const { cronInput } = getInputs()
    const parseButton = screen.getByRole('button', { name: /Parse Expression/i })

    fireEvent.change(cronInput, { target: { value: '* * * * *' } })
    fireEvent.click(parseButton)

    // There are two "Every minute" texts - the preset button and the description
    const everyMinuteTexts = screen.getAllByText('Every minute')
    expect(everyMinuteTexts.length).toBeGreaterThanOrEqual(2)
  })

  it('shows human-readable description for midnight', () => {
    render(<CronParserTool />)
    const { cronInput } = getInputs()
    const parseButton = screen.getByRole('button', { name: /Parse Expression/i })

    fireEvent.change(cronInput, { target: { value: '0 0 * * *' } })
    fireEvent.click(parseButton)

    expect(screen.getByText('At midnight every day')).toBeInTheDocument()
  })

  it('shows human-readable description for hourly', () => {
    render(<CronParserTool />)
    const { cronInput } = getInputs()
    const parseButton = screen.getByRole('button', { name: /Parse Expression/i })

    fireEvent.change(cronInput, { target: { value: '0 * * * *' } })
    fireEvent.click(parseButton)

    expect(screen.getByText('At the start of every hour')).toBeInTheDocument()
  })

  it('shows error for invalid cron expression', () => {
    render(<CronParserTool />)
    const { cronInput } = getInputs()
    const parseButton = screen.getByRole('button', { name: /Parse Expression/i })

    fireEvent.change(cronInput, { target: { value: 'invalid cron' } })
    fireEvent.click(parseButton)

    // Should show an error message
    const errorElement = document.querySelector('.text-\\[var\\(--color-red-500\\)\\]')
    expect(errorElement).toBeTruthy()
  })

  it('shows error when parsing empty input', () => {
    render(<CronParserTool />)
    const parseButton = screen.getByRole('button', { name: /Parse Expression/i })

    fireEvent.click(parseButton)

    expect(screen.getByText('Please enter a cron expression')).toBeInTheDocument()
  })

  it('allows setting number of executions to show', () => {
    render(<CronParserTool />)
    expect(screen.getByText('Number of executions to show')).toBeInTheDocument()

    const numInput = screen.getByDisplayValue('5') as HTMLInputElement
    fireEvent.change(numInput, { target: { value: '10' } })

    expect(numInput.value).toBe('10')
  })

  it('resets all fields when reset button is clicked', () => {
    render(<CronParserTool />)
    const { cronInput } = getInputs()
    const parseButton = screen.getByRole('button', { name: /Parse Expression/i })

    fireEvent.change(cronInput, { target: { value: '0 * * * *' } })
    fireEvent.click(parseButton)

    expect(screen.getByText('Next Execution Times (UTC)')).toBeInTheDocument()

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(cronInput.value).toBe('')
    expect(screen.queryByText('Next Execution Times (UTC)')).not.toBeInTheDocument()
    expect(screen.queryByText('Human-readable description')).not.toBeInTheDocument()
  })

  it('displays field reference section', () => {
    render(<CronParserTool />)
    expect(screen.getByText('Field Reference')).toBeInTheDocument()
    expect(screen.getByText('Minute')).toBeInTheDocument()
    expect(screen.getByText('Hour')).toBeInTheDocument()
    expect(screen.getByText('Day')).toBeInTheDocument()
    expect(screen.getByText('Month')).toBeInTheDocument()
    expect(screen.getByText('Weekday')).toBeInTheDocument()
  })

  it('displays valid ranges in field reference', () => {
    render(<CronParserTool />)
    expect(screen.getByText('0-59')).toBeInTheDocument()
    expect(screen.getByText('0-23')).toBeInTheDocument()
    expect(screen.getByText('1-31')).toBeInTheDocument()
    expect(screen.getByText('1-12')).toBeInTheDocument()
    expect(screen.getByText('0-6')).toBeInTheDocument()
  })

  it('shows executions in ISO format', () => {
    render(<CronParserTool />)
    const { cronInput } = getInputs()
    const parseButton = screen.getByRole('button', { name: /Parse Expression/i })

    fireEvent.change(cronInput, { target: { value: '0 0 * * *' } })
    fireEvent.click(parseButton)

    // Check that the output contains ISO date format
    const outputTextarea = getOutputTextarea()
    expect(outputTextarea?.value).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })
})
