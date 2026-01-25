import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { JsonPathTool } from '../json-path'

describe('JsonPathTool', () => {
  it('renders without crashing', () => {
    render(<JsonPathTool />)
    expect(screen.getByText('JSON Data')).toBeInTheDocument()
    expect(screen.getByText('Path Expression')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Extract Values' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays path syntax examples in helper text', () => {
    render(<JsonPathTool />)
    expect(screen.getByText(/Examples: \$.property/)).toBeInTheDocument()
  })

  it('shows error when extracting without JSON data', () => {
    render(<JsonPathTool />)

    const pathInput = screen.getByPlaceholderText(/\$.store.books\[0\].title/i)
    fireEvent.change(pathInput, { target: { value: '$.name' } })

    const extractButton = screen.getByRole('button', { name: 'Extract Values' })
    fireEvent.click(extractButton)

    expect(screen.getByText('Please enter JSON data')).toBeInTheDocument()
  })

  it('shows error when extracting without path expression', () => {
    render(<JsonPathTool />)

    const jsonInput = screen.getByPlaceholderText(/"store":/i)
    fireEvent.change(jsonInput, { target: { value: '{"name": "test"}' } })

    const extractButton = screen.getByRole('button', { name: 'Extract Values' })
    fireEvent.click(extractButton)

    expect(screen.getByText('Please enter a path expression')).toBeInTheDocument()
  })

  it('shows error for invalid JSON', () => {
    render(<JsonPathTool />)

    const jsonInput = screen.getByPlaceholderText(/"store":/i)
    fireEvent.change(jsonInput, { target: { value: 'invalid json' } })

    const pathInput = screen.getByPlaceholderText(/\$.store.books\[0\].title/i)
    fireEvent.change(pathInput, { target: { value: '$.name' } })

    const extractButton = screen.getByRole('button', { name: 'Extract Values' })
    fireEvent.click(extractButton)

    expect(screen.getByText(/Unexpected token/i)).toBeInTheDocument()
  })

  it('extracts simple property value', () => {
    render(<JsonPathTool />)

    const jsonInput = screen.getByPlaceholderText(/"store":/i)
    fireEvent.change(jsonInput, { target: { value: '{"name": "John", "age": 30}' } })

    const pathInput = screen.getByPlaceholderText(/\$.store.books\[0\].title/i)
    fireEvent.change(pathInput, { target: { value: '$.name' } })

    const extractButton = screen.getByRole('button', { name: 'Extract Values' })
    fireEvent.click(extractButton)

    expect(screen.getByText('Found 1 match')).toBeInTheDocument()
    expect(screen.getByText('Extracted Values')).toBeInTheDocument()
    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toBe('"John"')
  })

  it('extracts array element by index', () => {
    render(<JsonPathTool />)

    const jsonInput = screen.getByPlaceholderText(/"store":/i)
    fireEvent.change(jsonInput, { target: { value: '{"items": [1, 2, 3, 4, 5]}' } })

    const pathInput = screen.getByPlaceholderText(/\$.store.books\[0\].title/i)
    fireEvent.change(pathInput, { target: { value: '$.items[0]' } })

    const extractButton = screen.getByRole('button', { name: 'Extract Values' })
    fireEvent.click(extractButton)

    expect(screen.getByText('Found 1 match')).toBeInTheDocument()
    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toBe('1')
  })

  it('extracts all array elements with wildcard', () => {
    render(<JsonPathTool />)

    const jsonInput = screen.getByPlaceholderText(/"store":/i)
    fireEvent.change(jsonInput, { target: { value: '{"items": [1, 2, 3]}' } })

    const pathInput = screen.getByPlaceholderText(/\$.store.books\[0\].title/i)
    fireEvent.change(pathInput, { target: { value: '$.items[*]' } })

    const extractButton = screen.getByRole('button', { name: 'Extract Values' })
    fireEvent.click(extractButton)

    expect(screen.getByText('Found 3 matches')).toBeInTheDocument()
  })

  it('extracts nested property value', () => {
    render(<JsonPathTool />)

    const jsonInput = screen.getByPlaceholderText(/"store":/i)
    fireEvent.change(jsonInput, { target: { value: '{"store": {"name": "My Store"}}' } })

    const pathInput = screen.getByPlaceholderText(/\$.store.books\[0\].title/i)
    fireEvent.change(pathInput, { target: { value: '$.store.name' } })

    const extractButton = screen.getByRole('button', { name: 'Extract Values' })
    fireEvent.click(extractButton)

    expect(screen.getByText('Found 1 match')).toBeInTheDocument()
    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toBe('"My Store"')
  })

  it('extracts property from array of objects', () => {
    render(<JsonPathTool />)

    const jsonInput = screen.getByPlaceholderText(/"store":/i)
    fireEvent.change(jsonInput, { target: { value: '{"books": [{"title": "Book 1"}, {"title": "Book 2"}]}' } })

    const pathInput = screen.getByPlaceholderText(/\$.store.books\[0\].title/i)
    fireEvent.change(pathInput, { target: { value: '$.books[*].title' } })

    const extractButton = screen.getByRole('button', { name: 'Extract Values' })
    fireEvent.click(extractButton)

    expect(screen.getByText('Found 2 matches')).toBeInTheDocument()
    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('Book 1')
    expect(output.value).toContain('Book 2')
  })

  it('shows no matches message when path does not match', () => {
    render(<JsonPathTool />)

    const jsonInput = screen.getByPlaceholderText(/"store":/i)
    fireEvent.change(jsonInput, { target: { value: '{"name": "test"}' } })

    const pathInput = screen.getByPlaceholderText(/\$.store.books\[0\].title/i)
    fireEvent.change(pathInput, { target: { value: '$.nonexistent' } })

    const extractButton = screen.getByRole('button', { name: 'Extract Values' })
    fireEvent.click(extractButton)

    expect(screen.getByText('Found 0 matches')).toBeInTheDocument()
    expect(screen.getByText('No matches found')).toBeInTheDocument()
  })

  it('resets all fields when reset button is clicked', () => {
    render(<JsonPathTool />)

    // Enter some data
    const jsonInput = screen.getByPlaceholderText(/"store":/i)
    fireEvent.change(jsonInput, { target: { value: '{"name": "test"}' } })

    const pathInput = screen.getByPlaceholderText(/\$.store.books\[0\].title/i)
    fireEvent.change(pathInput, { target: { value: '$.name' } })

    const extractButton = screen.getByRole('button', { name: 'Extract Values' })
    fireEvent.click(extractButton)

    // Reset
    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(jsonInput).toHaveValue('')
    expect(pathInput).toHaveValue('')
    expect(screen.queryByText('Extracted Values')).not.toBeInTheDocument()
  })

  it('supports root reference $', () => {
    render(<JsonPathTool />)

    const jsonInput = screen.getByPlaceholderText(/"store":/i)
    fireEvent.change(jsonInput, { target: { value: '{"name": "test"}' } })

    const pathInput = screen.getByPlaceholderText(/\$.store.books\[0\].title/i)
    fireEvent.change(pathInput, { target: { value: '$' } })

    const extractButton = screen.getByRole('button', { name: 'Extract Values' })
    fireEvent.click(extractButton)

    expect(screen.getByText('Found 1 match')).toBeInTheDocument()
    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('name')
    expect(output.value).toContain('test')
  })

  it('supports negative array index', () => {
    render(<JsonPathTool />)

    const jsonInput = screen.getByPlaceholderText(/"store":/i)
    fireEvent.change(jsonInput, { target: { value: '{"items": [1, 2, 3, 4, 5]}' } })

    const pathInput = screen.getByPlaceholderText(/\$.store.books\[0\].title/i)
    fireEvent.change(pathInput, { target: { value: '$.items[-1]' } })

    const extractButton = screen.getByRole('button', { name: 'Extract Values' })
    fireEvent.click(extractButton)

    expect(screen.getByText('Found 1 match')).toBeInTheDocument()
    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toBe('5')
  })

  it('supports array slice notation', () => {
    render(<JsonPathTool />)

    const jsonInput = screen.getByPlaceholderText(/"store":/i)
    fireEvent.change(jsonInput, { target: { value: '{"items": [1, 2, 3, 4, 5]}' } })

    const pathInput = screen.getByPlaceholderText(/\$.store.books\[0\].title/i)
    fireEvent.change(pathInput, { target: { value: '$.items[0:2]' } })

    const extractButton = screen.getByRole('button', { name: 'Extract Values' })
    fireEvent.click(extractButton)

    expect(screen.getByText('Found 2 matches')).toBeInTheDocument()
    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('1')
    expect(output.value).toContain('2')
  })

  it('supports path without $ prefix', () => {
    render(<JsonPathTool />)

    const jsonInput = screen.getByPlaceholderText(/"store":/i)
    fireEvent.change(jsonInput, { target: { value: '{"store": {"name": "Test"}}' } })

    const pathInput = screen.getByPlaceholderText(/\$.store.books\[0\].title/i)
    fireEvent.change(pathInput, { target: { value: 'store.name' } })

    const extractButton = screen.getByRole('button', { name: 'Extract Values' })
    fireEvent.click(extractButton)

    expect(screen.getByText('Found 1 match')).toBeInTheDocument()
    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toBe('"Test"')
  })

  it('extracts complex nested structure', () => {
    render(<JsonPathTool />)

    const complexJson = JSON.stringify({
      store: {
        books: [
          { title: 'Book 1', price: 10 },
          { title: 'Book 2', price: 15 },
          { title: 'Book 3', price: 20 }
        ]
      }
    })

    const jsonInput = screen.getByPlaceholderText(/"store":/i)
    fireEvent.change(jsonInput, { target: { value: complexJson } })

    const pathInput = screen.getByPlaceholderText(/\$.store.books\[0\].title/i)
    fireEvent.change(pathInput, { target: { value: '$.store.books[*].price' } })

    const extractButton = screen.getByRole('button', { name: 'Extract Values' })
    fireEvent.click(extractButton)

    expect(screen.getByText('Found 3 matches')).toBeInTheDocument()
    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('10')
    expect(output.value).toContain('15')
    expect(output.value).toContain('20')
  })
})
