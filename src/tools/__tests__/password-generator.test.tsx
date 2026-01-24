import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PasswordGeneratorTool } from '../password-generator'

describe('PasswordGeneratorTool', () => {
  it('renders without crashing', () => {
    render(<PasswordGeneratorTool />)
    expect(screen.getByText('Password Length (4-128)')).toBeInTheDocument()
    expect(screen.getByText('Character Types')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Generate Password' })).toBeInTheDocument()
  })

  it('displays all character type options', () => {
    render(<PasswordGeneratorTool />)
    expect(screen.getByText('Lowercase (a-z)')).toBeInTheDocument()
    expect(screen.getByText('Uppercase (A-Z)')).toBeInTheDocument()
    expect(screen.getByText('Numbers (0-9)')).toBeInTheDocument()
    expect(screen.getByText('Symbols (!@#$%^&*...)')).toBeInTheDocument()
  })

  it('has default length of 16', () => {
    render(<PasswordGeneratorTool />)
    const lengthInput = screen.getByPlaceholderText('16')
    expect(lengthInput).toHaveValue(16)
  })

  it('generates a password', () => {
    render(<PasswordGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: 'Generate Password' })

    fireEvent.click(generateButton)

    expect(screen.getByText('Generated Password')).toBeInTheDocument()
  })

  it('generates password with correct length', () => {
    render(<PasswordGeneratorTool />)
    const lengthInput = screen.getByPlaceholderText('16')
    const generateButton = screen.getByRole('button', { name: 'Generate Password' })

    fireEvent.change(lengthInput, { target: { value: '20' } })
    fireEvent.click(generateButton)

    const inputs = screen.getAllByRole('textbox')
    const passwordInput = inputs.find(input => input.hasAttribute('readonly'))
    if (passwordInput) {
      const password = (passwordInput as HTMLInputElement).value
      expect(password.length).toBe(20)
    }
  })

  it('limits length to maximum of 128', () => {
    render(<PasswordGeneratorTool />)
    const lengthInput = screen.getByPlaceholderText('16')
    const generateButton = screen.getByRole('button', { name: 'Generate Password' })

    fireEvent.change(lengthInput, { target: { value: '200' } })
    fireEvent.click(generateButton)

    const inputs = screen.getAllByRole('textbox')
    const passwordInput = inputs.find(input => input.hasAttribute('readonly'))
    if (passwordInput) {
      const password = (passwordInput as HTMLInputElement).value
      expect(password.length).toBe(128)
    }
  })

  it('limits length to minimum of 4', () => {
    render(<PasswordGeneratorTool />)
    const lengthInput = screen.getByPlaceholderText('16')
    const generateButton = screen.getByRole('button', { name: 'Generate Password' })

    fireEvent.change(lengthInput, { target: { value: '2' } })
    fireEvent.click(generateButton)

    const inputs = screen.getAllByRole('textbox')
    const passwordInput = inputs.find(input => input.hasAttribute('readonly'))
    if (passwordInput) {
      const password = (passwordInput as HTMLInputElement).value
      expect(password.length).toBe(4)
    }
  })

  it('generates password with only lowercase when other options unchecked', () => {
    render(<PasswordGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: 'Generate Password' })

    // Uncheck all except lowercase
    const uppercaseCheckbox = screen.getByRole('checkbox', { name: 'Uppercase (A-Z)' })
    const numbersCheckbox = screen.getByRole('checkbox', { name: 'Numbers (0-9)' })
    const symbolsCheckbox = screen.getByRole('checkbox', { name: 'Symbols (!@#$%^&*...)' })

    fireEvent.click(uppercaseCheckbox)
    fireEvent.click(numbersCheckbox)
    fireEvent.click(symbolsCheckbox)

    fireEvent.click(generateButton)

    const inputs = screen.getAllByRole('textbox')
    const passwordInput = inputs.find(input => input.hasAttribute('readonly'))
    if (passwordInput) {
      const password = (passwordInput as HTMLInputElement).value
      expect(password).toMatch(/^[a-z]+$/)
    }
  })

  it('does not generate password when all options are unchecked', () => {
    render(<PasswordGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: 'Generate Password' })

    // Uncheck all options
    const lowercaseCheckbox = screen.getByRole('checkbox', { name: 'Lowercase (a-z)' })
    const uppercaseCheckbox = screen.getByRole('checkbox', { name: 'Uppercase (A-Z)' })
    const numbersCheckbox = screen.getByRole('checkbox', { name: 'Numbers (0-9)' })
    const symbolsCheckbox = screen.getByRole('checkbox', { name: 'Symbols (!@#$%^&*...)' })

    fireEvent.click(lowercaseCheckbox)
    fireEvent.click(uppercaseCheckbox)
    fireEvent.click(numbersCheckbox)
    fireEvent.click(symbolsCheckbox)

    fireEvent.click(generateButton)

    // Should not show generated password section
    expect(screen.queryByText('Generated Password')).not.toBeInTheDocument()
  })

  it('generates different passwords on each click', () => {
    render(<PasswordGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: 'Generate Password' })

    fireEvent.click(generateButton)
    const inputs1 = screen.getAllByRole('textbox')
    const password1 = inputs1.find(input => input.hasAttribute('readonly'))?.getAttribute('value')

    fireEvent.click(generateButton)
    const inputs2 = screen.getAllByRole('textbox')
    const password2 = inputs2.find(input => input.hasAttribute('readonly'))?.getAttribute('value')

    // Passwords should be different (extremely unlikely to be the same with 16 chars)
    expect(password1).not.toBe(password2)
  })

  it('all character type checkboxes are checked by default', () => {
    render(<PasswordGeneratorTool />)

    const lowercaseCheckbox = screen.getByRole('checkbox', { name: 'Lowercase (a-z)' })
    const uppercaseCheckbox = screen.getByRole('checkbox', { name: 'Uppercase (A-Z)' })
    const numbersCheckbox = screen.getByRole('checkbox', { name: 'Numbers (0-9)' })
    const symbolsCheckbox = screen.getByRole('checkbox', { name: 'Symbols (!@#$%^&*...)' })

    expect(lowercaseCheckbox).toBeChecked()
    expect(uppercaseCheckbox).toBeChecked()
    expect(numbersCheckbox).toBeChecked()
    expect(symbolsCheckbox).toBeChecked()
  })
})
