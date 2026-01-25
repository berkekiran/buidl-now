import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CronGeneratorTool } from '../cron-generator'

describe('CronGeneratorTool', () => {
  it('renders without crashing', () => {
    render(<CronGeneratorTool />)
    expect(screen.getByText('Quick Presets')).toBeInTheDocument()
    expect(screen.getByText('Minute')).toBeInTheDocument()
    expect(screen.getByText('Hour')).toBeInTheDocument()
    expect(screen.getByText('Day of Month')).toBeInTheDocument()
    expect(screen.getByText('Month')).toBeInTheDocument()
    expect(screen.getByText('Day of Week')).toBeInTheDocument()
  })

  it('shows default cron expression', () => {
    render(<CronGeneratorTool />)
    expect(screen.getAllByDisplayValue('* * * * *').length).toBeGreaterThanOrEqual(1)
  })

  it('shows default human-readable description', () => {
    render(<CronGeneratorTool />)
    expect(screen.getByText('Human-Readable Description')).toBeInTheDocument()
    expect(screen.getAllByText(/every minute/i).length).toBeGreaterThanOrEqual(1)
  })

  it('shows cron format reference', () => {
    render(<CronGeneratorTool />)
    expect(screen.getByText('Cron Format Reference')).toBeInTheDocument()
  })

  it('applies preset "Every minute"', () => {
    render(<CronGeneratorTool />)
    const presetButton = screen.getByRole('button', { name: 'Every minute' })
    fireEvent.click(presetButton)

    expect(screen.getAllByDisplayValue('* * * * *').length).toBeGreaterThanOrEqual(1)
  })

  it('applies preset "Every hour"', () => {
    render(<CronGeneratorTool />)
    const presetButton = screen.getByRole('button', { name: 'Every hour' })
    fireEvent.click(presetButton)

    expect(screen.getAllByDisplayValue('0 * * * *').length).toBeGreaterThanOrEqual(1)
  })

  it('applies preset "Every day at midnight"', () => {
    render(<CronGeneratorTool />)
    const presetButton = screen.getByRole('button', { name: 'Every day at midnight' })
    fireEvent.click(presetButton)

    expect(screen.getAllByDisplayValue('0 0 * * *').length).toBeGreaterThanOrEqual(1)
  })

  it('applies preset "Every day at noon"', () => {
    render(<CronGeneratorTool />)
    const presetButton = screen.getByRole('button', { name: 'Every day at noon' })
    fireEvent.click(presetButton)

    expect(screen.getAllByDisplayValue('0 12 * * *').length).toBeGreaterThanOrEqual(1)
  })

  it('applies preset "Every Monday at 9 AM"', () => {
    render(<CronGeneratorTool />)
    const presetButton = screen.getByRole('button', { name: 'Every Monday at 9 AM' })
    fireEvent.click(presetButton)

    expect(screen.getAllByDisplayValue('0 9 * * 1').length).toBeGreaterThanOrEqual(1)
  })

  it('applies preset "Every weekday at 9 AM"', () => {
    render(<CronGeneratorTool />)
    const presetButton = screen.getByRole('button', { name: 'Every weekday at 9 AM' })
    fireEvent.click(presetButton)

    expect(screen.getAllByDisplayValue('0 9 * * 1-5').length).toBeGreaterThanOrEqual(1)
  })

  it('changes minute field', () => {
    render(<CronGeneratorTool />)

    const minuteSelect = screen.getAllByRole('combobox')[0]
    fireEvent.change(minuteSelect, { target: { value: '30' } })

    expect(screen.getAllByDisplayValue('30 * * * *').length).toBeGreaterThanOrEqual(1)
  })

  it('changes hour field', () => {
    render(<CronGeneratorTool />)

    const hourSelect = screen.getAllByRole('combobox')[1]
    fireEvent.change(hourSelect, { target: { value: '9' } })

    expect(screen.getAllByDisplayValue('* 9 * * *').length).toBeGreaterThanOrEqual(1)
  })

  it('changes day of month field', () => {
    render(<CronGeneratorTool />)

    const dayOfMonthSelect = screen.getAllByRole('combobox')[2]
    fireEvent.change(dayOfMonthSelect, { target: { value: '15' } })

    expect(screen.getAllByDisplayValue('* * 15 * *').length).toBeGreaterThanOrEqual(1)
  })

  it('changes month field', () => {
    render(<CronGeneratorTool />)

    const monthSelect = screen.getAllByRole('combobox')[3]
    fireEvent.change(monthSelect, { target: { value: '6' } })

    expect(screen.getAllByDisplayValue('* * * 6 *').length).toBeGreaterThanOrEqual(1)
  })

  it('changes day of week field', () => {
    render(<CronGeneratorTool />)

    const dayOfWeekSelect = screen.getAllByRole('combobox')[4]
    fireEvent.change(dayOfWeekSelect, { target: { value: '1' } })

    expect(screen.getAllByDisplayValue('* * * * 1').length).toBeGreaterThanOrEqual(1)
  })

  it('resets to default when reset button is clicked', () => {
    render(<CronGeneratorTool />)

    // Apply a preset first
    const presetButton = screen.getByRole('button', { name: 'Every Monday at 9 AM' })
    fireEvent.click(presetButton)

    expect(screen.getAllByDisplayValue('0 9 * * 1').length).toBeGreaterThanOrEqual(1)

    // Reset
    const resetButton = screen.getByRole('button', { name: 'Reset to Default' })
    fireEvent.click(resetButton)

    expect(screen.getAllByDisplayValue('* * * * *').length).toBeGreaterThanOrEqual(1)
  })

  it('updates description when expression changes', () => {
    render(<CronGeneratorTool />)

    const presetButton = screen.getByRole('button', { name: 'Every Monday at 9 AM' })
    fireEvent.click(presetButton)

    expect(screen.getAllByText(/Monday/i).length).toBeGreaterThanOrEqual(1)
  })

  it('handles every 5 minutes preset implicitly by selecting */5', () => {
    render(<CronGeneratorTool />)

    const minuteSelect = screen.getAllByRole('combobox')[0]
    fireEvent.change(minuteSelect, { target: { value: '*/5' } })

    expect(screen.getAllByDisplayValue('*/5 * * * *').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/every 5 minutes/i)).toBeInTheDocument()
  })

  it('handles weekday selection', () => {
    render(<CronGeneratorTool />)

    const dayOfWeekSelect = screen.getAllByRole('combobox')[4]
    fireEvent.change(dayOfWeekSelect, { target: { value: '1-5' } })

    expect(screen.getAllByDisplayValue('* * * * 1-5').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/weekdays/i).length).toBeGreaterThanOrEqual(1)
  })

  it('handles weekend selection', () => {
    render(<CronGeneratorTool />)

    const dayOfWeekSelect = screen.getAllByRole('combobox')[4]
    fireEvent.change(dayOfWeekSelect, { target: { value: '0,6' } })

    expect(screen.getAllByDisplayValue('* * * * 0,6').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/weekends/i).length).toBeGreaterThanOrEqual(1)
  })

  it('shows month name in description', () => {
    render(<CronGeneratorTool />)

    const monthSelect = screen.getAllByRole('combobox')[3]
    fireEvent.change(monthSelect, { target: { value: '1' } })

    expect(screen.getAllByText(/January/i).length).toBeGreaterThanOrEqual(1)
  })

  it('combines multiple field changes', () => {
    render(<CronGeneratorTool />)

    const minuteSelect = screen.getAllByRole('combobox')[0]
    const hourSelect = screen.getAllByRole('combobox')[1]
    const dayOfMonthSelect = screen.getAllByRole('combobox')[2]

    fireEvent.change(minuteSelect, { target: { value: '0' } })
    fireEvent.change(hourSelect, { target: { value: '12' } })
    fireEvent.change(dayOfMonthSelect, { target: { value: '1' } })

    expect(screen.getAllByDisplayValue('0 12 1 * *').length).toBeGreaterThanOrEqual(1)
  })

  it('handles every 15 minutes', () => {
    render(<CronGeneratorTool />)

    const minuteSelect = screen.getAllByRole('combobox')[0]
    fireEvent.change(minuteSelect, { target: { value: '*/15' } })

    expect(screen.getAllByDisplayValue('*/15 * * * *').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/every 15 minutes/i)).toBeInTheDocument()
  })

  it('handles every 30 minutes', () => {
    render(<CronGeneratorTool />)

    const minuteSelect = screen.getAllByRole('combobox')[0]
    fireEvent.change(minuteSelect, { target: { value: '*/30' } })

    expect(screen.getAllByDisplayValue('*/30 * * * *').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/every 30 minutes/i)).toBeInTheDocument()
  })

  it('handles specific day selection', () => {
    render(<CronGeneratorTool />)

    const dayOfWeekSelect = screen.getAllByRole('combobox')[4]
    fireEvent.change(dayOfWeekSelect, { target: { value: '0' } })

    expect(screen.getAllByDisplayValue('* * * * 0').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Sunday/i).length).toBeGreaterThanOrEqual(1)
  })

  it('displays input with copy functionality', () => {
    render(<CronGeneratorTool />)
    expect(screen.getByText('Cron Expression')).toBeInTheDocument()
    // The input should have readOnly attribute
    const inputs = screen.getAllByDisplayValue('* * * * *')
    expect(inputs[0]).toHaveAttribute('readonly')
  })
})
