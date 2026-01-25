import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GraphqlFormatterTool } from '../graphql-formatter'

describe('GraphqlFormatterTool', () => {
  it('renders without crashing', () => {
    render(<GraphqlFormatterTool />)
    expect(screen.getByText('GraphQL Query / Schema')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Format GraphQL' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays placeholder text', () => {
    render(<GraphqlFormatterTool />)
    expect(screen.getByPlaceholderText(/query \{ user/)).toBeInTheDocument()
  })

  it('formats minified GraphQL query', () => {
    render(<GraphqlFormatterTool />)
    const textarea = screen.getByPlaceholderText(/query \{ user/)

    fireEvent.change(textarea, {
      target: { value: 'query { user(id: 1) { name email } }' }
    })

    const formatButton = screen.getByRole('button', { name: 'Format GraphQL' })
    fireEvent.click(formatButton)

    expect(screen.getByText('Formatted GraphQL')).toBeInTheDocument()
  })

  it('shows formatted output with indentation', () => {
    render(<GraphqlFormatterTool />)
    const textarea = screen.getByPlaceholderText(/query \{ user/)

    fireEvent.change(textarea, {
      target: { value: 'query { user { name } }' }
    })

    const formatButton = screen.getByRole('button', { name: 'Format GraphQL' })
    fireEvent.click(formatButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toContain('\n')
    expect(outputTextarea?.value).toContain('  ')
  })

  it('formats nested queries', () => {
    render(<GraphqlFormatterTool />)
    const textarea = screen.getByPlaceholderText(/query \{ user/)

    fireEvent.change(textarea, {
      target: { value: 'query { user { posts { title comments { text author { name } } } } }' }
    })

    const formatButton = screen.getByRole('button', { name: 'Format GraphQL' })
    fireEvent.click(formatButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    // Should have multiple indentation levels
    const lines = outputTextarea?.value.split('\n')
    expect(lines.length).toBeGreaterThan(5)
  })

  it('formats mutations', () => {
    render(<GraphqlFormatterTool />)
    const textarea = screen.getByPlaceholderText(/query \{ user/)

    fireEvent.change(textarea, {
      target: { value: 'mutation { createUser(name: "John", email: "john@example.com") { id name } }' }
    })

    const formatButton = screen.getByRole('button', { name: 'Format GraphQL' })
    fireEvent.click(formatButton)

    expect(screen.getByText('Formatted GraphQL')).toBeInTheDocument()
    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toContain('mutation')
  })

  it('formats type definitions', () => {
    render(<GraphqlFormatterTool />)
    const textarea = screen.getByPlaceholderText(/query \{ user/)

    fireEvent.change(textarea, {
      target: { value: 'type User { id: ID! name: String! email: String posts: [Post!]! }' }
    })

    const formatButton = screen.getByRole('button', { name: 'Format GraphQL' })
    fireEvent.click(formatButton)

    expect(screen.getByText('Formatted GraphQL')).toBeInTheDocument()
  })

  it('handles query with arguments', () => {
    render(<GraphqlFormatterTool />)
    const textarea = screen.getByPlaceholderText(/query \{ user/)

    fireEvent.change(textarea, {
      target: { value: 'query { user(id: 123, status: ACTIVE) { name age } }' }
    })

    const formatButton = screen.getByRole('button', { name: 'Format GraphQL' })
    fireEvent.click(formatButton)

    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toContain('id:')
  })

  it('handles fragments', () => {
    render(<GraphqlFormatterTool />)
    const textarea = screen.getByPlaceholderText(/query \{ user/)

    fireEvent.change(textarea, {
      target: { value: 'fragment UserFields on User { id name email }' }
    })

    const formatButton = screen.getByRole('button', { name: 'Format GraphQL' })
    fireEvent.click(formatButton)

    expect(screen.getByText('Formatted GraphQL')).toBeInTheDocument()
  })

  it('handles subscriptions', () => {
    render(<GraphqlFormatterTool />)
    const textarea = screen.getByPlaceholderText(/query \{ user/)

    fireEvent.change(textarea, {
      target: { value: 'subscription { messageAdded { id content sender { name } } }' }
    })

    const formatButton = screen.getByRole('button', { name: 'Format GraphQL' })
    fireEvent.click(formatButton)

    expect(screen.getByText('Formatted GraphQL')).toBeInTheDocument()
    const textareas = screen.getAllByRole('textbox')
    const outputTextarea = textareas.find(t => t.hasAttribute('readonly')) as HTMLTextAreaElement
    expect(outputTextarea?.value).toContain('subscription')
  })

  it('resets all fields when reset button is clicked', () => {
    render(<GraphqlFormatterTool />)
    const textarea = screen.getByPlaceholderText(/query \{ user/) as HTMLTextAreaElement

    fireEvent.change(textarea, {
      target: { value: 'query { user { name } }' }
    })

    const formatButton = screen.getByRole('button', { name: 'Format GraphQL' })
    fireEvent.click(formatButton)

    expect(screen.getByText('Formatted GraphQL')).toBeInTheDocument()

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(textarea.value).toBe('')
    expect(screen.queryByText('Formatted GraphQL')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<GraphqlFormatterTool />)
    const formatButton = screen.getByRole('button', { name: 'Format GraphQL' })
    fireEvent.click(formatButton)

    // Should not show output for empty input
    expect(screen.queryByText('Formatted GraphQL')).not.toBeInTheDocument()
  })

  it('handles input types', () => {
    render(<GraphqlFormatterTool />)
    const textarea = screen.getByPlaceholderText(/query \{ user/)

    fireEvent.change(textarea, {
      target: { value: 'input CreateUserInput { name: String! email: String! password: String! }' }
    })

    const formatButton = screen.getByRole('button', { name: 'Format GraphQL' })
    fireEvent.click(formatButton)

    expect(screen.getByText('Formatted GraphQL')).toBeInTheDocument()
  })

  it('handles enum types', () => {
    render(<GraphqlFormatterTool />)
    const textarea = screen.getByPlaceholderText(/query \{ user/)

    fireEvent.change(textarea, {
      target: { value: 'enum Status { ACTIVE INACTIVE PENDING }' }
    })

    const formatButton = screen.getByRole('button', { name: 'Format GraphQL' })
    fireEvent.click(formatButton)

    expect(screen.getByText('Formatted GraphQL')).toBeInTheDocument()
  })

  it('handles interface definitions', () => {
    render(<GraphqlFormatterTool />)
    const textarea = screen.getByPlaceholderText(/query \{ user/)

    fireEvent.change(textarea, {
      target: { value: 'interface Node { id: ID! }' }
    })

    const formatButton = screen.getByRole('button', { name: 'Format GraphQL' })
    fireEvent.click(formatButton)

    expect(screen.getByText('Formatted GraphQL')).toBeInTheDocument()
  })

  it('handles whitespace-only input', () => {
    render(<GraphqlFormatterTool />)
    const textarea = screen.getByPlaceholderText(/query \{ user/)

    fireEvent.change(textarea, {
      target: { value: '   \n   \n   ' }
    })

    const formatButton = screen.getByRole('button', { name: 'Format GraphQL' })
    fireEvent.click(formatButton)

    // Should not show output for whitespace-only input
    expect(screen.queryByText('Formatted GraphQL')).not.toBeInTheDocument()
  })
})
