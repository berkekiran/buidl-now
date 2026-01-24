import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { JsonYamlTool } from '../json-yaml'

describe('JsonYamlTool', () => {
  it('renders without crashing', () => {
    render(<JsonYamlTool />)
    expect(screen.getByText('JSON')).toBeInTheDocument()
    expect(screen.getByText('YAML')).toBeInTheDocument()
  })

  it('renders JSON and YAML textareas', () => {
    render(<JsonYamlTool />)
    const textareas = screen.getAllByRole('textbox')
    expect(textareas.length).toBeGreaterThanOrEqual(2)
  })

  it('converts JSON to YAML when JSON input changes', async () => {
    render(<JsonYamlTool />)
    const jsonTextarea = screen.getByPlaceholderText('{"name":"John","age":30}')

    fireEvent.change(jsonTextarea, {
      target: { value: '{"name":"John","age":30}' }
    })

    await waitFor(() => {
      // Get the other textarea (YAML output)
      const textareas = screen.getAllByRole('textbox')
      const yamlTextarea = textareas.find(t => t !== jsonTextarea) as HTMLTextAreaElement
      // Check that something was converted
      expect(yamlTextarea?.value || '').toContain('name')
    })
  })

  it('converts YAML to JSON when YAML input changes', async () => {
    render(<JsonYamlTool />)
    const yamlTextarea = screen.getByPlaceholderText(/name: John/)

    fireEvent.change(yamlTextarea, {
      target: { value: 'name: Jane\nage: 25' }
    })

    await waitFor(() => {
      const textareas = screen.getAllByRole('textbox')
      const jsonTextarea = textareas.find(t => t !== yamlTextarea) as HTMLTextAreaElement
      expect(jsonTextarea?.value || '').toContain('Jane')
    })
  })

  it('displays swap button', () => {
    render(<JsonYamlTool />)
    const swapButton = screen.getByTitle('Swap')
    expect(swapButton).toBeInTheDocument()
  })

  it('handles swap button click without crashing', () => {
    render(<JsonYamlTool />)
    const jsonTextarea = screen.getByPlaceholderText('{"name":"John","age":30}')

    fireEvent.change(jsonTextarea, { target: { value: '{"test": 1}' } })

    const swapButton = screen.getByTitle('Swap')
    fireEvent.click(swapButton)

    // Just verify it doesn't crash
    expect(swapButton).toBeInTheDocument()
  })

  it('handles invalid JSON gracefully', () => {
    render(<JsonYamlTool />)
    const jsonTextarea = screen.getByPlaceholderText('{"name":"John","age":30}')

    fireEvent.change(jsonTextarea, { target: { value: 'invalid json {' } })

    // Component should not crash
    expect(jsonTextarea).toBeInTheDocument()
  })
})
