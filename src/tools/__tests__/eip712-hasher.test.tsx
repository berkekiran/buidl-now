import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Eip712HasherTool } from '../eip712-hasher'

describe('Eip712HasherTool', () => {
  it('renders without crashing', () => {
    render(<Eip712HasherTool />)
    expect(screen.getByText('Domain (JSON)')).toBeInTheDocument()
    expect(screen.getByText('Types (JSON)')).toBeInTheDocument()
    expect(screen.getByText('Message (JSON)')).toBeInTheDocument()
    expect(screen.getByText('Primary Type')).toBeInTheDocument()
  })

  it('has calculate and reset buttons', () => {
    render(<Eip712HasherTool />)
    expect(screen.getByRole('button', { name: /calculate hash/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('shows error when fields are missing', () => {
    render(<Eip712HasherTool />)

    const calculateButton = screen.getByRole('button', { name: /calculate hash/i })
    fireEvent.click(calculateButton)

    expect(screen.getByText(/all fields are required/i)).toBeInTheDocument()
  })

  it('handles reset correctly', () => {
    render(<Eip712HasherTool />)

    const domainTextarea = screen.getByPlaceholderText(/name.*mydapp/i)
    fireEvent.change(domainTextarea, { target: { value: '{"test": "value"}' } })

    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)

    expect(domainTextarea).toHaveValue('')
  })

  it('shows error for invalid JSON', () => {
    render(<Eip712HasherTool />)

    const domainTextarea = screen.getByPlaceholderText(/name.*mydapp/i)
    const textareas = screen.getAllByRole('textbox')
    const typesTextarea = textareas[1] // Types is the second textarea
    const messageTextarea = textareas[2] // Message is the third textarea
    const inputs = screen.getAllByRole('textbox')
    // Find the Primary Type input (last input field)
    const primaryTypeInput = inputs[inputs.length - 1]

    fireEvent.change(domainTextarea, { target: { value: 'invalid json' } })
    fireEvent.change(typesTextarea, { target: { value: '{"Person":[]}' } })
    fireEvent.change(messageTextarea, { target: { value: '{}' } })
    fireEvent.change(primaryTypeInput, { target: { value: 'Person' } })

    const calculateButton = screen.getByRole('button', { name: /calculate hash/i })
    fireEvent.click(calculateButton)

    // Should show an error
    const errorElement = document.querySelector('.text-\\[var\\(--color-red-500\\)\\]')
    expect(errorElement).toBeInTheDocument()
  })

  it('does not show hash outputs initially', () => {
    render(<Eip712HasherTool />)
    expect(screen.queryByText('Step 1: Domain Separator')).not.toBeInTheDocument()
    expect(screen.queryByText('Step 2: Message Hash')).not.toBeInTheDocument()
    expect(screen.queryByText('Step 3: Final EIP-712 Hash')).not.toBeInTheDocument()
  })
})
