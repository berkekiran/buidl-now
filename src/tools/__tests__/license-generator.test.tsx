import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LicenseGeneratorTool } from '../license-generator'

describe('LicenseGeneratorTool', () => {
  it('renders without crashing', () => {
    render(<LicenseGeneratorTool />)
    expect(screen.getByText('Select License')).toBeInTheDocument()
    expect(screen.getByText('Year')).toBeInTheDocument()
    expect(screen.getByText('Author / Copyright Holder')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Generate License' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('has license selector with all license options', () => {
    render(<LicenseGeneratorTool />)
    const licenseSelect = screen.getByRole('combobox')
    expect(licenseSelect).toHaveValue('mit')

    expect(screen.getByRole('option', { name: 'MIT License' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Apache License 2.0' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'GNU General Public License v3.0' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'BSD 3-Clause License' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'ISC License' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'The Unlicense' })).toBeInTheDocument()
  })

  it('displays license description', () => {
    render(<LicenseGeneratorTool />)
    expect(screen.getByText(/short and simple permissive license/i)).toBeInTheDocument()
  })

  it('displays permissions, conditions, and limitations', () => {
    render(<LicenseGeneratorTool />)
    expect(screen.getByText('Permissions')).toBeInTheDocument()
    expect(screen.getByText('Conditions')).toBeInTheDocument()
    expect(screen.getByText('Limitations')).toBeInTheDocument()

    // MIT permissions
    expect(screen.getByText('+ Commercial use')).toBeInTheDocument()
    expect(screen.getByText('+ Modification')).toBeInTheDocument()
    expect(screen.getByText('+ Distribution')).toBeInTheDocument()
    expect(screen.getByText('+ Private use')).toBeInTheDocument()

    // MIT limitations
    expect(screen.getByText('- Liability')).toBeInTheDocument()
    expect(screen.getByText('- Warranty')).toBeInTheDocument()
  })

  it('has current year as default', () => {
    render(<LicenseGeneratorTool />)
    const currentYear = new Date().getFullYear().toString()
    const yearInput = screen.getByPlaceholderText(currentYear)
    expect(yearInput).toHaveValue(currentYear)
  })

  it('generates MIT license', () => {
    render(<LicenseGeneratorTool />)

    const authorInput = screen.getByPlaceholderText('John Doe')
    fireEvent.change(authorInput, { target: { value: 'Test Author' } })

    const generateButton = screen.getByRole('button', { name: 'Generate License' })
    fireEvent.click(generateButton)

    expect(screen.getByText('Generated LICENSE')).toBeInTheDocument()
    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('MIT License')
    expect(output.value).toContain('Test Author')
    expect(output.value).toContain('Permission is hereby granted')
  })

  it('generates Apache 2.0 license', () => {
    render(<LicenseGeneratorTool />)

    const licenseSelect = screen.getByRole('combobox')
    fireEvent.change(licenseSelect, { target: { value: 'apache-2.0' } })

    const authorInput = screen.getByPlaceholderText('John Doe')
    fireEvent.change(authorInput, { target: { value: 'Test Author' } })

    const generateButton = screen.getByRole('button', { name: 'Generate License' })
    fireEvent.click(generateButton)

    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('Apache License')
    expect(output.value).toContain('Version 2.0')
  })

  it('generates GPL 3.0 license', () => {
    render(<LicenseGeneratorTool />)

    const licenseSelect = screen.getByRole('combobox')
    fireEvent.change(licenseSelect, { target: { value: 'gpl-3.0' } })

    const generateButton = screen.getByRole('button', { name: 'Generate License' })
    fireEvent.click(generateButton)

    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('GNU GENERAL PUBLIC LICENSE')
    expect(output.value).toContain('Version 3')
  })

  it('generates ISC license', () => {
    render(<LicenseGeneratorTool />)

    const licenseSelect = screen.getByRole('combobox')
    fireEvent.change(licenseSelect, { target: { value: 'isc' } })

    const authorInput = screen.getByPlaceholderText('John Doe')
    fireEvent.change(authorInput, { target: { value: 'Test Author' } })

    const generateButton = screen.getByRole('button', { name: 'Generate License' })
    fireEvent.click(generateButton)

    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('ISC License')
    expect(output.value).toContain('Test Author')
  })

  it('generates Unlicense', () => {
    render(<LicenseGeneratorTool />)

    const licenseSelect = screen.getByRole('combobox')
    fireEvent.change(licenseSelect, { target: { value: 'unlicense' } })

    const generateButton = screen.getByRole('button', { name: 'Generate License' })
    fireEvent.click(generateButton)

    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('public domain')
  })

  it('uses default author placeholder when author is empty', () => {
    render(<LicenseGeneratorTool />)

    const generateButton = screen.getByRole('button', { name: 'Generate License' })
    fireEvent.click(generateButton)

    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('[Author Name]')
  })

  it('includes custom year in generated license', () => {
    render(<LicenseGeneratorTool />)

    const yearInput = screen.getByPlaceholderText(new Date().getFullYear().toString())
    fireEvent.change(yearInput, { target: { value: '2020' } })

    const generateButton = screen.getByRole('button', { name: 'Generate License' })
    fireEvent.click(generateButton)

    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('2020')
  })

  it('updates license info when changing license type', () => {
    render(<LicenseGeneratorTool />)

    // Initially MIT
    expect(screen.getByText(/short and simple permissive license/i)).toBeInTheDocument()

    // Change to Apache
    const licenseSelect = screen.getByRole('combobox')
    fireEvent.change(licenseSelect, { target: { value: 'apache-2.0' } })

    expect(screen.getByText(/patent rights/i)).toBeInTheDocument()
  })

  it('resets all fields when reset button is clicked', () => {
    render(<LicenseGeneratorTool />)

    // Change values
    const licenseSelect = screen.getByRole('combobox')
    fireEvent.change(licenseSelect, { target: { value: 'apache-2.0' } })

    const authorInput = screen.getByPlaceholderText('John Doe')
    fireEvent.change(authorInput, { target: { value: 'Test Author' } })

    const generateButton = screen.getByRole('button', { name: 'Generate License' })
    fireEvent.click(generateButton)

    // Reset
    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(licenseSelect).toHaveValue('mit')
    expect(authorInput).toHaveValue('')
    expect(screen.queryByText('Generated LICENSE')).not.toBeInTheDocument()
  })

  it('shows different conditions for different licenses', () => {
    render(<LicenseGeneratorTool />)

    // Change to GPL
    const licenseSelect = screen.getByRole('combobox')
    fireEvent.change(licenseSelect, { target: { value: 'gpl-3.0' } })

    expect(screen.getByText('= Disclose source')).toBeInTheDocument()
    expect(screen.getByText('= Same license')).toBeInTheDocument()
  })

  it('shows None for conditions when license has no conditions', () => {
    render(<LicenseGeneratorTool />)

    // Change to Unlicense
    const licenseSelect = screen.getByRole('combobox')
    fireEvent.change(licenseSelect, { target: { value: 'unlicense' } })

    expect(screen.getByText('None')).toBeInTheDocument()
  })
})
