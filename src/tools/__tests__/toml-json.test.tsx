import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { TomlJsonTool } from '../toml-json'

// Ensure cleanup after each test
afterEach(() => {
  cleanup()
})

// Helper to get textareas
const getTextareas = () => {
  const textareas = screen.getAllByRole('textbox')
  return {
    tomlInput: textareas[0] as HTMLTextAreaElement,
    jsonInput: textareas[1] as HTMLTextAreaElement
  }
}

describe('TomlJsonTool', () => {
  it('renders without crashing', () => {
    render(<TomlJsonTool />)
    expect(screen.getByText('TOML')).toBeInTheDocument()
    expect(screen.getByText('JSON')).toBeInTheDocument()
    expect(screen.getByTitle('Swap')).toBeInTheDocument()
  })

  it('displays correct placeholders', () => {
    render(<TomlJsonTool />)
    const { tomlInput, jsonInput } = getTextareas()
    expect(tomlInput.placeholder).toMatch(/\[package\]/)
    expect(jsonInput.placeholder).toMatch(/{"package"/)
  })

  it('converts TOML to JSON when TOML input changes', async () => {
    render(<TomlJsonTool />)
    const { tomlInput, jsonInput } = getTextareas()

    fireEvent.change(tomlInput, { target: { value: 'name = "test"' } })

    await waitFor(() => {
      expect(jsonInput.value).toContain('"name"')
      expect(jsonInput.value).toContain('"test"')
    })
  })

  it('converts TOML table to JSON object', async () => {
    render(<TomlJsonTool />)
    const { tomlInput, jsonInput } = getTextareas()

    fireEvent.change(tomlInput, { target: { value: '[package]\nname = "my-app"\nversion = "1.0.0"' } })

    await waitFor(() => {
      expect(jsonInput.value).toContain('"package"')
      expect(jsonInput.value).toContain('"name"')
      expect(jsonInput.value).toContain('"my-app"')
      expect(jsonInput.value).toContain('"version"')
      expect(jsonInput.value).toContain('"1.0.0"')
    })
  })

  it('converts TOML array to JSON', async () => {
    render(<TomlJsonTool />)
    const { tomlInput, jsonInput } = getTextareas()

    fireEvent.change(tomlInput, { target: { value: 'ports = [8080, 8081, 8082]' } })

    await waitFor(() => {
      expect(jsonInput.value).toContain('"ports"')
      expect(jsonInput.value).toContain('8080')
      expect(jsonInput.value).toContain('8081')
      expect(jsonInput.value).toContain('8082')
    })
  })

  it('converts JSON to TOML when JSON input changes', async () => {
    render(<TomlJsonTool />)
    const { tomlInput, jsonInput } = getTextareas()

    fireEvent.change(jsonInput, { target: { value: '{"name": "test-project"}' } })

    await waitFor(() => {
      expect(tomlInput.value).toContain('name')
      expect(tomlInput.value).toContain('test-project')
    })
  })

  it('converts JSON nested object to TOML tables', async () => {
    render(<TomlJsonTool />)
    const { tomlInput, jsonInput } = getTextareas()

    fireEvent.change(jsonInput, { target: { value: '{"database": {"host": "localhost", "port": 5432}}' } })

    await waitFor(() => {
      expect(tomlInput.value).toContain('[database]')
      expect(tomlInput.value).toContain('host')
      expect(tomlInput.value).toContain('localhost')
      expect(tomlInput.value).toContain('port')
    })
  })

  it('shows error for invalid TOML', async () => {
    render(<TomlJsonTool />)
    const { tomlInput } = getTextareas()

    fireEvent.change(tomlInput, { target: { value: '[invalid\nname = value' } })

    await waitFor(() => {
      const errorElement = document.querySelector('.text-\\[var\\(--color-red-500\\)\\]')
      expect(errorElement).toBeTruthy()
    })
  })

  it('shows error for invalid JSON', async () => {
    render(<TomlJsonTool />)
    const { jsonInput } = getTextareas()

    fireEvent.change(jsonInput, { target: { value: '{"name": invalid}' } })

    await waitFor(() => {
      const errorElement = document.querySelector('.text-\\[var\\(--color-red-500\\)\\]')
      expect(errorElement).toBeTruthy()
    })
  })

  it('swaps values when swap button is clicked', async () => {
    render(<TomlJsonTool />)
    const { tomlInput, jsonInput } = getTextareas()

    fireEvent.change(tomlInput, { target: { value: 'title = "Test"' } })

    await waitFor(() => {
      expect(jsonInput.value).toContain('"title"')
    })

    const swapButton = screen.getByTitle('Swap')
    fireEvent.click(swapButton)

    // After swap, TOML input should have the JSON content
    await waitFor(() => {
      expect(tomlInput.value).toContain('"title"')
    })
  })

  it('handles empty input gracefully', () => {
    render(<TomlJsonTool />)
    const { tomlInput } = getTextareas()

    fireEvent.change(tomlInput, { target: { value: '' } })

    // Should not crash and no error should be displayed
    expect(screen.queryByText(/Invalid/)).not.toBeInTheDocument()
  })

  it('handles boolean values correctly', async () => {
    render(<TomlJsonTool />)
    const { tomlInput, jsonInput } = getTextareas()

    fireEvent.change(tomlInput, { target: { value: 'enabled = true\ndisabled = false' } })

    await waitFor(() => {
      expect(jsonInput.value).toContain('true')
      expect(jsonInput.value).toContain('false')
    })
  })

  it('handles numeric values correctly', async () => {
    render(<TomlJsonTool />)
    const { tomlInput, jsonInput } = getTextareas()

    fireEvent.change(tomlInput, { target: { value: 'port = 8080\nprice = 19.99' } })

    await waitFor(() => {
      expect(jsonInput.value).toContain('8080')
      expect(jsonInput.value).toContain('19.99')
    })
  })
})
