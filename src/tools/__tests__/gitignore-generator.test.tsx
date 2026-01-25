import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GitignoreGeneratorTool } from '../gitignore-generator'

describe('GitignoreGeneratorTool', () => {
  it('renders without crashing', () => {
    render(<GitignoreGeneratorTool />)
    expect(screen.getByText('Select Templates')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Select All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Generate .gitignore' })).toBeInTheDocument()
  })

  it('displays template categories', () => {
    render(<GitignoreGeneratorTool />)
    expect(screen.getByText('Languages')).toBeInTheDocument()
    expect(screen.getByText('Frameworks')).toBeInTheDocument()
    expect(screen.getByText('OS')).toBeInTheDocument()
    expect(screen.getByText('IDE')).toBeInTheDocument()
    expect(screen.getByText('Tools')).toBeInTheDocument()
  })

  it('displays template options', () => {
    render(<GitignoreGeneratorTool />)
    expect(screen.getByText('Node.js')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
    expect(screen.getByText('Java')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('macOS')).toBeInTheDocument()
    expect(screen.getByText('VS Code')).toBeInTheDocument()
  })

  it('has default selections', () => {
    render(<GitignoreGeneratorTool />)
    // Default selections are nodejs, macos, vscode
    const checkboxes = screen.getAllByRole('checkbox')
    const checkedBoxes = checkboxes.filter(cb => (cb as HTMLInputElement).checked)
    expect(checkedBoxes.length).toBe(3)
  })

  it('generates gitignore content when generate button is clicked', () => {
    render(<GitignoreGeneratorTool />)
    const generateButton = screen.getByRole('button', { name: 'Generate .gitignore' })
    fireEvent.click(generateButton)

    expect(screen.getByText('Generated .gitignore')).toBeInTheDocument()
    // Should contain node_modules since Node.js is selected by default
    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('node_modules/')
  })

  it('selects all templates when Select All is clicked', () => {
    render(<GitignoreGeneratorTool />)
    const selectAllButton = screen.getByRole('button', { name: 'Select All' })
    fireEvent.click(selectAllButton)

    const checkboxes = screen.getAllByRole('checkbox')
    const checkedBoxes = checkboxes.filter(cb => (cb as HTMLInputElement).checked)
    expect(checkedBoxes.length).toBe(checkboxes.length)
  })

  it('clears all templates when Clear All is clicked', () => {
    render(<GitignoreGeneratorTool />)
    const clearAllButton = screen.getByRole('button', { name: 'Clear All' })
    fireEvent.click(clearAllButton)

    const checkboxes = screen.getAllByRole('checkbox')
    const checkedBoxes = checkboxes.filter(cb => (cb as HTMLInputElement).checked)
    expect(checkedBoxes.length).toBe(0)
  })

  it('toggles template selection on checkbox click', () => {
    render(<GitignoreGeneratorTool />)

    // Find Python checkbox by label
    const pythonCheckbox = screen.getByRole('checkbox', { name: 'Python' })
    const initialChecked = (pythonCheckbox as HTMLInputElement).checked
    fireEvent.click(pythonCheckbox)
    expect((pythonCheckbox as HTMLInputElement).checked).toBe(!initialChecked)
  })

  it('generates empty output when no templates are selected', () => {
    render(<GitignoreGeneratorTool />)

    // Clear all selections
    const clearAllButton = screen.getByRole('button', { name: 'Clear All' })
    fireEvent.click(clearAllButton)

    // Generate
    const generateButton = screen.getByRole('button', { name: 'Generate .gitignore' })
    fireEvent.click(generateButton)

    // Should not show the output section
    expect(screen.queryByText('Generated .gitignore')).not.toBeInTheDocument()
  })

  it('includes Python patterns when Python is selected', () => {
    render(<GitignoreGeneratorTool />)

    // Clear and select only Python
    const clearAllButton = screen.getByRole('button', { name: 'Clear All' })
    fireEvent.click(clearAllButton)

    const pythonCheckbox = screen.getByRole('checkbox', { name: 'Python' })
    fireEvent.click(pythonCheckbox)

    const generateButton = screen.getByRole('button', { name: 'Generate .gitignore' })
    fireEvent.click(generateButton)

    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('__pycache__/')
    expect(output.value).toContain('.venv')
  })

  it('combines multiple template contents', () => {
    render(<GitignoreGeneratorTool />)

    // Default has Node.js, macOS, VS Code selected
    const generateButton = screen.getByRole('button', { name: 'Generate .gitignore' })
    fireEvent.click(generateButton)

    const textareas = document.querySelectorAll('textarea')
    const output = Array.from(textareas).find(t => t.readOnly) as HTMLTextAreaElement
    expect(output.value).toContain('node_modules/')
    expect(output.value).toContain('.DS_Store')
    expect(output.value).toContain('.vscode/')
  })
})
