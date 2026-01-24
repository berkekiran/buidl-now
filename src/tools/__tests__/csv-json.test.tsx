import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CsvJsonTool } from '../csv-json'

describe('CsvJsonTool', () => {
  it('renders without crashing', () => {
    render(<CsvJsonTool />)
    expect(screen.getByText('CSV')).toBeInTheDocument()
    expect(screen.getByText('JSON')).toBeInTheDocument()
    expect(screen.getByText('Delimiter')).toBeInTheDocument()
    expect(screen.getByText('First Row')).toBeInTheDocument()
  })

  it('shows delimiter options', () => {
    render(<CsvJsonTool />)
    expect(screen.getByRole('button', { name: 'Comma (,)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Semicolon (;)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tab' })).toBeInTheDocument()
  })

  it('shows header options', () => {
    render(<CsvJsonTool />)
    expect(screen.getByRole('button', { name: 'Contains Headers' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'No Headers' })).toBeInTheDocument()
  })

  it('converts simple CSV to JSON with headers', () => {
    render(<CsvJsonTool />)
    const csvTextarea = screen.getByPlaceholderText(/name,age,city/)
    fireEvent.change(csvTextarea, { target: { value: 'name,age\nJohn,30\nJane,25' } })

    const jsonTextarea = screen.getByPlaceholderText(/\[{"name":"John"/)
    const expected = [
      { name: 'John', age: '30' },
      { name: 'Jane', age: '25' }
    ]
    expect(jsonTextarea).toHaveValue(JSON.stringify(expected, null, 2))
  })

  it('converts CSV to JSON without headers', () => {
    render(<CsvJsonTool />)
    fireEvent.click(screen.getByRole('button', { name: 'No Headers' }))

    const csvTextarea = screen.getByPlaceholderText(/name,age,city/)
    fireEvent.change(csvTextarea, { target: { value: 'John,30\nJane,25' } })

    const jsonTextarea = screen.getByPlaceholderText(/\[{"name":"John"/)
    const parsed = JSON.parse((jsonTextarea as HTMLTextAreaElement).value)
    expect(parsed[0]).toHaveProperty('column1', 'John')
    expect(parsed[0]).toHaveProperty('column2', '30')
  })

  it('converts JSON to CSV', () => {
    render(<CsvJsonTool />)
    const jsonTextarea = screen.getByPlaceholderText(/\[{"name":"John"/)
    const jsonInput = JSON.stringify([
      { name: 'John', age: '30' },
      { name: 'Jane', age: '25' }
    ])
    fireEvent.change(jsonTextarea, { target: { value: jsonInput } })

    const csvTextarea = screen.getByPlaceholderText(/name,age,city/) as HTMLTextAreaElement
    expect(csvTextarea.value).toContain('name')
    expect(csvTextarea.value).toContain('John')
    expect(csvTextarea.value).toContain('Jane')
  })

  it('handles semicolon delimiter', () => {
    render(<CsvJsonTool />)
    fireEvent.click(screen.getByRole('button', { name: 'Semicolon (;)' }))

    const csvTextarea = screen.getByPlaceholderText(/name,age,city/)
    fireEvent.change(csvTextarea, { target: { value: 'name;age\nJohn;30' } })

    const jsonTextarea = screen.getByPlaceholderText(/\[{"name":"John"/)
    const expected = [{ name: 'John', age: '30' }]
    expect(jsonTextarea).toHaveValue(JSON.stringify(expected, null, 2))
  })

  it('handles quoted values in CSV', () => {
    render(<CsvJsonTool />)
    const csvTextarea = screen.getByPlaceholderText(/name,age,city/)
    fireEvent.change(csvTextarea, { target: { value: 'name,message\nJohn,"Hello, World"' } })

    const jsonTextarea = screen.getByPlaceholderText(/\[{"name":"John"/)
    const parsed = JSON.parse((jsonTextarea as HTMLTextAreaElement).value)
    expect(parsed[0].message).toBe('Hello, World')
  })

  it('shows error for invalid JSON', () => {
    render(<CsvJsonTool />)
    const jsonTextarea = screen.getByPlaceholderText(/\[{"name":"John"/)
    fireEvent.change(jsonTextarea, { target: { value: 'not valid json' } })

    // Check for any error message displayed
    const errorMessages = screen.getAllByText(/./i)
    expect(errorMessages.length).toBeGreaterThan(0)
  })

  it('shows error for non-array JSON', () => {
    render(<CsvJsonTool />)
    const jsonTextarea = screen.getByPlaceholderText(/\[{"name":"John"/)
    fireEvent.change(jsonTextarea, { target: { value: '{"name": "John"}' } })

    expect(screen.getByText(/JSON must be an array/)).toBeInTheDocument()
  })

  it('shows error for empty JSON array', () => {
    render(<CsvJsonTool />)
    const jsonTextarea = screen.getByPlaceholderText(/\[{"name":"John"/)
    fireEvent.change(jsonTextarea, { target: { value: '[]' } })

    expect(screen.getByText(/JSON array is empty/)).toBeInTheDocument()
  })

  it('has swap button', () => {
    render(<CsvJsonTool />)
    const swapButton = screen.getByTitle('Swap')
    expect(swapButton).toBeInTheDocument()
  })

  it('swaps content on swap button click', () => {
    render(<CsvJsonTool />)
    const csvTextarea = screen.getByPlaceholderText(/name,age,city/) as HTMLTextAreaElement
    const jsonTextarea = screen.getByPlaceholderText(/\[{"name":"John"/) as HTMLTextAreaElement

    fireEvent.change(csvTextarea, { target: { value: 'name,age\nJohn,30' } })
    const originalJson = jsonTextarea.value

    fireEvent.click(screen.getByTitle('Swap'))

    expect(csvTextarea.value).toBe(originalJson)
  })

  it('handles escaped quotes in CSV', () => {
    render(<CsvJsonTool />)
    const csvTextarea = screen.getByPlaceholderText(/name,age,city/)
    fireEvent.change(csvTextarea, { target: { value: 'name,quote\nJohn,"She said ""Hi"""' } })

    const jsonTextarea = screen.getByPlaceholderText(/\[{"name":"John"/)
    const parsed = JSON.parse((jsonTextarea as HTMLTextAreaElement).value)
    expect(parsed[0].quote).toBe('She said "Hi"')
  })
})
