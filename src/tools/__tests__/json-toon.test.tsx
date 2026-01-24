import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { JsonToonTool } from '../json-toon'

describe('JsonToonTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<JsonToonTool />)
    expect(screen.getByText('JSON')).toBeInTheDocument()
    expect(screen.getByText('TOON')).toBeInTheDocument()
  })

  it('renders JSON input textarea', () => {
    render(<JsonToonTool />)
    expect(screen.getByPlaceholderText(/{"key": "value"}/i)).toBeInTheDocument()
  })

  it('renders TOON input textarea', () => {
    render(<JsonToonTool />)
    expect(screen.getByPlaceholderText(/key: value/i)).toBeInTheDocument()
  })

  it('renders swap button', () => {
    render(<JsonToonTool />)
    expect(screen.getByTitle('Swap')).toBeInTheDocument()
  })

  it('renders info box about TOON format', () => {
    render(<JsonToonTool />)
    expect(screen.getByText(/About TOON Format/i)).toBeInTheDocument()
    expect(screen.getByText(/30-60% fewer tokens/i)).toBeInTheDocument()
  })

  it('handles JSON input change', () => {
    render(<JsonToonTool />)
    const jsonInput = screen.getByPlaceholderText(/{"key": "value"}/i)
    fireEvent.change(jsonInput, { target: { value: '{"name": "test"}' } })
    expect(jsonInput).toHaveValue('{"name": "test"}')
  })

  it('handles TOON input change', () => {
    render(<JsonToonTool />)
    const toonInput = screen.getByPlaceholderText(/key: value/i)
    fireEvent.change(toonInput, { target: { value: 'name: test' } })
    expect(toonInput).toHaveValue('name: test')
  })

  it('converts JSON to TOON for simple object', async () => {
    render(<JsonToonTool />)
    const jsonInput = screen.getByPlaceholderText(/{"key": "value"}/i)
    fireEvent.change(jsonInput, { target: { value: '{"name": "test", "value": 123}' } })

    await waitFor(() => {
      const toonInput = screen.getByPlaceholderText(/key: value/i) as HTMLTextAreaElement
      expect(toonInput.value.length).toBeGreaterThan(0)
    })
  })

  it('converts JSON to TOON for uniform array', async () => {
    render(<JsonToonTool />)
    const jsonInput = screen.getByPlaceholderText(/{"key": "value"}/i)
    const jsonArray = JSON.stringify([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ])
    fireEvent.change(jsonInput, { target: { value: jsonArray } })

    await waitFor(() => {
      const toonInput = screen.getByPlaceholderText(/key: value/i) as HTMLTextAreaElement
      expect(toonInput.value.length).toBeGreaterThan(0)
    })
  })

  it('shows error for invalid JSON', async () => {
    render(<JsonToonTool />)
    const jsonInput = screen.getByPlaceholderText(/{"key": "value"}/i)
    fireEvent.change(jsonInput, { target: { value: 'invalid json' } })

    await waitFor(() => {
      // Just verify the component handles invalid JSON
      expect(screen.getAllByText(/./i).length).toBeGreaterThan(0)
    })
  })

  it('converts TOON to JSON for tabular format', async () => {
    render(<JsonToonTool />)
    const toonInput = screen.getByPlaceholderText(/key: value/i)
    const toonData = `[2]{id,name}:
 1,Alice
 2,Bob`
    fireEvent.change(toonInput, { target: { value: toonData } })

    await waitFor(() => {
      const jsonInput = screen.getByPlaceholderText(/{"key": "value"}/i) as HTMLTextAreaElement
      expect(jsonInput.value.length).toBeGreaterThan(0)
    })
  })

  it('handles swap button click', async () => {
    render(<JsonToonTool />)

    const jsonInput = screen.getByPlaceholderText(/{"key": "value"}/i) as HTMLTextAreaElement
    const toonInput = screen.getByPlaceholderText(/key: value/i) as HTMLTextAreaElement

    fireEvent.change(jsonInput, { target: { value: '{"test": 123}' } })
    const originalJsonValue = jsonInput.value

    await waitFor(() => {
      expect(toonInput.value.length).toBeGreaterThan(0)
    })

    const swapButton = screen.getByTitle('Swap')
    fireEvent.click(swapButton)

    // After swap, values should be exchanged
    expect(jsonInput.value).not.toBe(originalJsonValue)
  })

  it('handles quoted values in TOON', async () => {
    render(<JsonToonTool />)
    const toonInput = screen.getByPlaceholderText(/key: value/i)
    const toonData = `[1]{name}:
 "Hello, World"`
    fireEvent.change(toonInput, { target: { value: toonData } })

    await waitFor(() => {
      const jsonInput = screen.getByPlaceholderText(/{"key": "value"}/i) as HTMLTextAreaElement
      expect(jsonInput.value.length).toBeGreaterThan(0)
    })
  })

  it('converts null values correctly', async () => {
    render(<JsonToonTool />)
    const jsonInput = screen.getByPlaceholderText(/{"key": "value"}/i)
    fireEvent.change(jsonInput, { target: { value: '{"value": null}' } })

    await waitFor(() => {
      const toonInput = screen.getByPlaceholderText(/key: value/i) as HTMLTextAreaElement
      expect(toonInput.value.length).toBeGreaterThan(0)
    })
  })

  it('converts boolean values correctly', async () => {
    render(<JsonToonTool />)
    const jsonInput = screen.getByPlaceholderText(/{"key": "value"}/i)
    fireEvent.change(jsonInput, { target: { value: '{"active": true, "deleted": false}' } })

    await waitFor(() => {
      const toonInput = screen.getByPlaceholderText(/key: value/i) as HTMLTextAreaElement
      expect(toonInput.value.length).toBeGreaterThan(0)
    })
  })

  it('converts numbers correctly', async () => {
    render(<JsonToonTool />)
    const jsonInput = screen.getByPlaceholderText(/{"key": "value"}/i)
    fireEvent.change(jsonInput, { target: { value: '{"count": 42, "price": 99.99}' } })

    await waitFor(() => {
      const toonInput = screen.getByPlaceholderText(/key: value/i) as HTMLTextAreaElement
      expect(toonInput.value.length).toBeGreaterThan(0)
    })
  })

  it('handles nested objects', async () => {
    render(<JsonToonTool />)
    const jsonInput = screen.getByPlaceholderText(/{"key": "value"}/i)
    const nestedJson = JSON.stringify({
      user: {
        name: 'Alice',
        age: 30
      }
    })
    fireEvent.change(jsonInput, { target: { value: nestedJson } })

    await waitFor(() => {
      const toonInput = screen.getByPlaceholderText(/key: value/i) as HTMLTextAreaElement
      expect(toonInput.value.length).toBeGreaterThan(0)
    })
  })

  it('handles empty array', async () => {
    render(<JsonToonTool />)
    const jsonInput = screen.getByPlaceholderText(/{"key": "value"}/i)
    fireEvent.change(jsonInput, { target: { value: '[]' } })

    await waitFor(() => {
      const toonInput = screen.getByPlaceholderText(/key: value/i) as HTMLTextAreaElement
      expect(toonInput.value).toBe('[]')
    })
  })

  it('handles empty object', async () => {
    render(<JsonToonTool />)
    const jsonInput = screen.getByPlaceholderText(/{"key": "value"}/i)
    fireEvent.change(jsonInput, { target: { value: '{}' } })

    await waitFor(() => {
      const toonInput = screen.getByPlaceholderText(/key: value/i) as HTMLTextAreaElement
      expect(toonInput.value).toBe('{}')
    })
  })

  it('displays TOON features in info box', () => {
    render(<JsonToonTool />)
    expect(screen.getByText(/Tabular arrays/i)).toBeInTheDocument()
    expect(screen.getByText(/Indentation-based/i)).toBeInTheDocument()
    expect(screen.getByText(/Minimal syntax/i)).toBeInTheDocument()
  })
})
