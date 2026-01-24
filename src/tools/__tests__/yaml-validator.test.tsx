import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { YamlValidatorTool } from '../yaml-validator'

describe('YamlValidatorTool', () => {
  it('renders without crashing', () => {
    render(<YamlValidatorTool />)
    expect(screen.getByText('YAML Input')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /validate yaml/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('shows validation result for valid YAML', () => {
    render(<YamlValidatorTool />)

    const textarea = screen.getByPlaceholderText(/name: John Doe/i)
    fireEvent.change(textarea, { target: { value: 'name: John\nage: 30' } })

    const validateButton = screen.getByRole('button', { name: /validate yaml/i })
    fireEvent.click(validateButton)

    expect(screen.getByText('Valid YAML')).toBeInTheDocument()
    expect(screen.getByText('Parsed as JSON')).toBeInTheDocument()
  })

  it('shows error for invalid YAML', () => {
    render(<YamlValidatorTool />)

    const textarea = screen.getByPlaceholderText(/name: John Doe/i)
    // Use truly invalid YAML - array item without parent key
    fireEvent.change(textarea, { target: { value: '- item without parent' } })

    const validateButton = screen.getByRole('button', { name: /validate yaml/i })
    fireEvent.click(validateButton)

    expect(screen.getByText('Invalid YAML')).toBeInTheDocument()
  })

  it('handles reset button correctly', () => {
    render(<YamlValidatorTool />)

    const textarea = screen.getByPlaceholderText(/name: John Doe/i)
    fireEvent.change(textarea, { target: { value: 'name: Test' } })

    const validateButton = screen.getByRole('button', { name: /validate yaml/i })
    fireEvent.click(validateButton)

    expect(screen.getByText('Valid YAML')).toBeInTheDocument()

    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)

    expect(textarea).toHaveValue('')
    expect(screen.queryByText('Valid YAML')).not.toBeInTheDocument()
  })

  it('parses nested YAML objects correctly', () => {
    render(<YamlValidatorTool />)

    const textarea = screen.getByPlaceholderText(/name: John Doe/i)
    const nestedYaml = `user:
  name: Alice
  address:
    city: NYC`

    fireEvent.change(textarea, { target: { value: nestedYaml } })

    const validateButton = screen.getByRole('button', { name: /validate yaml/i })
    fireEvent.click(validateButton)

    expect(screen.getByText('Valid YAML')).toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<YamlValidatorTool />)

    const validateButton = screen.getByRole('button', { name: /validate yaml/i })
    fireEvent.click(validateButton)

    // Should not show valid or invalid state for empty input
    expect(screen.queryByText('Valid YAML')).not.toBeInTheDocument()
    expect(screen.queryByText('Invalid YAML')).not.toBeInTheDocument()
  })
})
