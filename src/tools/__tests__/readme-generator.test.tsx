import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ReadmeGeneratorTool } from '../readme-generator'

describe('ReadmeGeneratorTool', () => {
  it('renders without crashing', () => {
    render(<ReadmeGeneratorTool />)
    expect(screen.getByText('Template Style')).toBeInTheDocument()
    expect(screen.getByText('Project Name *')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Generate README' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays template style buttons', () => {
    render(<ReadmeGeneratorTool />)
    expect(screen.getByRole('button', { name: 'Minimal' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Standard' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Detailed' })).toBeInTheDocument()
  })

  it('displays style description for standard (default)', () => {
    render(<ReadmeGeneratorTool />)
    expect(screen.getByText('Balanced with key sections')).toBeInTheDocument()
  })

  it('updates style description when style is changed', () => {
    render(<ReadmeGeneratorTool />)

    const minimalButton = screen.getByRole('button', { name: 'Minimal' })
    fireEvent.click(minimalButton)
    expect(screen.getByText('Simple and concise')).toBeInTheDocument()

    const detailedButton = screen.getByRole('button', { name: 'Detailed' })
    fireEvent.click(detailedButton)
    expect(screen.getByText('Comprehensive with all sections')).toBeInTheDocument()
  })

  it('displays all input fields', () => {
    render(<ReadmeGeneratorTool />)
    expect(screen.getByPlaceholderText('My Awesome Project')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/brief description/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Fast and lightweight/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('npm install')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('npm start')).toBeInTheDocument()
  })

  it('has license selector with options', () => {
    render(<ReadmeGeneratorTool />)
    const licenseSelect = screen.getByRole('combobox')
    expect(licenseSelect).toHaveValue('MIT')

    // Check that options exist
    expect(screen.getByRole('option', { name: 'MIT' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Apache 2.0' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'GPL 3.0' })).toBeInTheDocument()
  })

  it('does not generate without project name', () => {
    render(<ReadmeGeneratorTool />)

    const generateButton = screen.getByRole('button', { name: 'Generate README' })
    fireEvent.click(generateButton)

    expect(screen.queryByText('Generated README.md')).not.toBeInTheDocument()
  })

  it('generates minimal README', () => {
    render(<ReadmeGeneratorTool />)

    // Select minimal style
    const minimalButton = screen.getByRole('button', { name: 'Minimal' })
    fireEvent.click(minimalButton)

    // Enter project name
    const projectNameInput = screen.getByPlaceholderText('My Awesome Project')
    fireEvent.change(projectNameInput, { target: { value: 'Test Project' } })

    // Generate
    const generateButton = screen.getByRole('button', { name: 'Generate README' })
    fireEvent.click(generateButton)

    expect(screen.getByText('Generated README.md')).toBeInTheDocument()
    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('# Test Project')
    expect(output.value).toContain('## Installation')
    expect(output.value).toContain('## Usage')
  })

  it('generates standard README with features section', () => {
    render(<ReadmeGeneratorTool />)

    const projectNameInput = screen.getByPlaceholderText('My Awesome Project')
    fireEvent.change(projectNameInput, { target: { value: 'Test Project' } })

    const featuresInput = screen.getByPlaceholderText(/Fast and lightweight/i)
    fireEvent.change(featuresInput, { target: { value: 'Feature 1\nFeature 2' } })

    const generateButton = screen.getByRole('button', { name: 'Generate README' })
    fireEvent.click(generateButton)

    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('## Features')
    expect(output.value).toContain('- Feature 1')
    expect(output.value).toContain('- Feature 2')
    expect(output.value).toContain('## Contributing')
  })

  it('generates detailed README with table of contents', () => {
    render(<ReadmeGeneratorTool />)

    // Select detailed style
    const detailedButton = screen.getByRole('button', { name: 'Detailed' })
    fireEvent.click(detailedButton)

    const projectNameInput = screen.getByPlaceholderText('My Awesome Project')
    fireEvent.change(projectNameInput, { target: { value: 'Test Project' } })

    const generateButton = screen.getByRole('button', { name: 'Generate README' })
    fireEvent.click(generateButton)

    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('## Table of Contents')
    expect(output.value).toContain('## Prerequisites')
    expect(output.value).toContain('## Configuration')
    expect(output.value).toContain('## API Reference')
    expect(output.value).toContain('## Testing')
  })

  it('includes author name in generated README', () => {
    render(<ReadmeGeneratorTool />)

    const projectNameInput = screen.getByPlaceholderText('My Awesome Project')
    fireEvent.change(projectNameInput, { target: { value: 'Test Project' } })

    const authorInput = screen.getByPlaceholderText('John Doe')
    fireEvent.change(authorInput, { target: { value: 'Jane Smith' } })

    const generateButton = screen.getByRole('button', { name: 'Generate README' })
    fireEvent.click(generateButton)

    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('Jane Smith')
  })

  it('includes selected license in generated README', () => {
    render(<ReadmeGeneratorTool />)

    const projectNameInput = screen.getByPlaceholderText('My Awesome Project')
    fireEvent.change(projectNameInput, { target: { value: 'Test Project' } })

    const licenseSelect = screen.getByRole('combobox')
    fireEvent.change(licenseSelect, { target: { value: 'Apache-2.0' } })

    const generateButton = screen.getByRole('button', { name: 'Generate README' })
    fireEvent.click(generateButton)

    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('Apache-2.0')
  })

  it('resets all fields when reset button is clicked', () => {
    render(<ReadmeGeneratorTool />)

    // Fill in some fields
    const projectNameInput = screen.getByPlaceholderText('My Awesome Project')
    fireEvent.change(projectNameInput, { target: { value: 'Test Project' } })

    const authorInput = screen.getByPlaceholderText('John Doe')
    fireEvent.change(authorInput, { target: { value: 'Jane Smith' } })

    // Generate
    const generateButton = screen.getByRole('button', { name: 'Generate README' })
    fireEvent.click(generateButton)

    // Reset
    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(projectNameInput).toHaveValue('')
    expect(authorInput).toHaveValue('')
    expect(screen.queryByText('Generated README.md')).not.toBeInTheDocument()
  })

  it('includes custom installation and usage commands', () => {
    render(<ReadmeGeneratorTool />)

    const projectNameInput = screen.getByPlaceholderText('My Awesome Project')
    fireEvent.change(projectNameInput, { target: { value: 'Test Project' } })

    const installInput = screen.getByPlaceholderText('npm install') as HTMLInputElement
    fireEvent.change(installInput, { target: { value: 'yarn add my-package' } })

    const usageInput = screen.getByPlaceholderText('npm start') as HTMLInputElement
    fireEvent.change(usageInput, { target: { value: 'yarn dev' } })

    const generateButton = screen.getByRole('button', { name: 'Generate README' })
    fireEvent.click(generateButton)

    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('yarn add my-package')
    expect(output.value).toContain('yarn dev')
  })
})
