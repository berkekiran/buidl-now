import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HashGeneratorTool } from '../hash-generator'

describe('HashGeneratorTool', () => {
  it('renders without crashing', () => {
    render(<HashGeneratorTool />)
    expect(screen.getByText('Input Text')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Generate' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays all hash algorithm labels', () => {
    render(<HashGeneratorTool />)
    expect(screen.getByText('MD5')).toBeInTheDocument()
    expect(screen.getByText('SHA-1')).toBeInTheDocument()
    expect(screen.getByText('SHA-256')).toBeInTheDocument()
    expect(screen.getByText('SHA-512')).toBeInTheDocument()
  })

  it('generates hashes when text is entered', () => {
    render(<HashGeneratorTool />)
    const input = screen.getByPlaceholderText('Enter text to hash...')

    fireEvent.change(input, { target: { value: 'Hello, World!' } })

    // Check MD5 hash for "Hello, World!"
    expect(screen.getByDisplayValue('65a8e27d8879283831b664bd8b7f0ad4')).toBeInTheDocument()

    // Check SHA-256 hash for "Hello, World!"
    expect(screen.getByDisplayValue('dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f')).toBeInTheDocument()
  })

  it('clears hashes when input is cleared', () => {
    render(<HashGeneratorTool />)
    const input = screen.getByPlaceholderText('Enter text to hash...')

    // First generate hashes
    fireEvent.change(input, { target: { value: 'test' } })

    // Then clear input
    fireEvent.change(input, { target: { value: '' } })

    // All hash fields should be empty
    const hashInputs = screen.getAllByRole('textbox').filter(
      (el) => el.getAttribute('readonly') !== null
    )
    hashInputs.forEach((hashInput) => {
      expect(hashInput).toHaveValue('')
    })
  })

  it('resets all fields when reset button is clicked', () => {
    render(<HashGeneratorTool />)
    const input = screen.getByPlaceholderText('Enter text to hash...')

    fireEvent.change(input, { target: { value: 'test' } })

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(input).toHaveValue('')
  })

  it('generates different hashes for different inputs', () => {
    render(<HashGeneratorTool />)
    const input = screen.getByPlaceholderText('Enter text to hash...')

    // First input
    fireEvent.change(input, { target: { value: 'test1' } })
    const md5Hash1 = screen.getAllByRole('textbox').find(
      (el) => el.getAttribute('readonly') !== null
    )?.getAttribute('value')

    // Second input
    fireEvent.change(input, { target: { value: 'test2' } })
    const md5Hash2 = screen.getAllByRole('textbox').find(
      (el) => el.getAttribute('readonly') !== null
    )?.getAttribute('value')

    expect(md5Hash1).not.toBe(md5Hash2)
  })

  it('generate button triggers hash calculation', () => {
    render(<HashGeneratorTool />)
    const input = screen.getByPlaceholderText('Enter text to hash...')
    const generateButton = screen.getByRole('button', { name: 'Generate' })

    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.click(generateButton)

    // Should have generated hashes
    const hashInputs = screen.getAllByRole('textbox').filter(
      (el) => el.getAttribute('readonly') !== null
    )
    expect(hashInputs.some((el) => el.getAttribute('value') !== '')).toBe(true)
  })
})
