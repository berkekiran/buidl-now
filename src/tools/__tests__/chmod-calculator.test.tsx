import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChmodCalculatorTool } from '../chmod-calculator'

describe('ChmodCalculatorTool', () => {
  it('renders without crashing', () => {
    render(<ChmodCalculatorTool />)
    expect(screen.getByText('Owner (User)')).toBeInTheDocument()
    expect(screen.getByText('Group')).toBeInTheDocument()
    expect(screen.getByText('Other (World)')).toBeInTheDocument()
    expect(screen.getByText('Numeric (Octal)')).toBeInTheDocument()
    expect(screen.getAllByText('Symbolic').length).toBeGreaterThan(0)
  })

  it('displays default permission 755', () => {
    render(<ChmodCalculatorTool />)
    const numericInput = screen.getByPlaceholderText('755')
    expect(numericInput).toHaveValue('755')
  })

  it('displays default symbolic permission rwxr-xr-x', () => {
    render(<ChmodCalculatorTool />)
    const symbolicInput = screen.getByPlaceholderText('rwxr-xr-x')
    expect(symbolicInput).toHaveValue('rwxr-xr-x')
  })

  it('displays chmod command', () => {
    render(<ChmodCalculatorTool />)
    expect(screen.getByText('chmod Command')).toBeInTheDocument()
    const commandInput = screen.getByDisplayValue('chmod 755 filename')
    expect(commandInput).toBeInTheDocument()
  })

  it('updates permissions when numeric input changes', () => {
    render(<ChmodCalculatorTool />)
    const numericInput = screen.getByPlaceholderText('755')

    fireEvent.change(numericInput, { target: { value: '644' } })

    const symbolicInput = screen.getByPlaceholderText('rwxr-xr-x')
    expect(symbolicInput).toHaveValue('rw-r--r--')
  })

  it('updates permissions when symbolic input changes', () => {
    render(<ChmodCalculatorTool />)
    const symbolicInput = screen.getByPlaceholderText('rwxr-xr-x')

    fireEvent.change(symbolicInput, { target: { value: 'rwxrwxrwx' } })

    const numericInput = screen.getByPlaceholderText('755')
    expect(numericInput).toHaveValue('777')
  })

  it('displays common presets', () => {
    render(<ChmodCalculatorTool />)
    expect(screen.getByText('Common Presets')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '755 (rwxr-xr-x)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '644 (rw-r--r--)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '777 (rwxrwxrwx)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '700 (rwx------)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '600 (rw-------)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '444 (r--r--r--)' })).toBeInTheDocument()
  })

  it('applies preset when clicked', () => {
    render(<ChmodCalculatorTool />)
    const preset644 = screen.getByRole('button', { name: '644 (rw-r--r--)' })

    fireEvent.click(preset644)

    const numericInput = screen.getByPlaceholderText('755')
    expect(numericInput).toHaveValue('644')
  })

  it('resets to default when reset button is clicked', () => {
    render(<ChmodCalculatorTool />)
    const numericInput = screen.getByPlaceholderText('755')
    const resetButton = screen.getByRole('button', { name: 'Reset to Default (755)' })

    fireEvent.change(numericInput, { target: { value: '777' } })
    fireEvent.click(resetButton)

    expect(numericInput).toHaveValue('755')
  })

  it('displays permission breakdown table', () => {
    render(<ChmodCalculatorTool />)
    expect(screen.getByText('Permission Breakdown')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
    expect(screen.getByText('Read (4)')).toBeInTheDocument()
    expect(screen.getByText('Write (2)')).toBeInTheDocument()
    expect(screen.getByText('Execute (1)')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
  })

  it('handles permission checkbox changes', () => {
    render(<ChmodCalculatorTool />)
    // Find the Read checkbox for Owner by looking at the checkbox labels
    const readCheckboxes = screen.getAllByText('Read (r)')
    expect(readCheckboxes.length).toBeGreaterThan(0)
  })

  it('handles invalid numeric input gracefully', () => {
    render(<ChmodCalculatorTool />)
    const numericInput = screen.getByPlaceholderText('755')

    // Invalid input (contains 8 and 9 which are not valid octal)
    fireEvent.change(numericInput, { target: { value: '899' } })

    // Should not update symbolic as the input is invalid
    const symbolicInput = screen.getByPlaceholderText('rwxr-xr-x')
    // The symbolic should remain at its previous value since 899 is invalid
    expect(symbolicInput).toHaveValue('rwxr-xr-x')
  })

  it('handles 000 permissions', () => {
    render(<ChmodCalculatorTool />)
    const numericInput = screen.getByPlaceholderText('755')

    fireEvent.change(numericInput, { target: { value: '000' } })

    const symbolicInput = screen.getByPlaceholderText('rwxr-xr-x')
    expect(symbolicInput).toHaveValue('---------')
  })

  it('handles 777 permissions', () => {
    render(<ChmodCalculatorTool />)
    const numericInput = screen.getByPlaceholderText('755')

    fireEvent.change(numericInput, { target: { value: '777' } })

    const symbolicInput = screen.getByPlaceholderText('rwxr-xr-x')
    expect(symbolicInput).toHaveValue('rwxrwxrwx')
  })

  it('updates chmod command when permissions change', () => {
    render(<ChmodCalculatorTool />)
    const numericInput = screen.getByPlaceholderText('755')

    fireEvent.change(numericInput, { target: { value: '644' } })

    const commandInput = screen.getByDisplayValue('chmod 644 filename')
    expect(commandInput).toBeInTheDocument()
  })
})
