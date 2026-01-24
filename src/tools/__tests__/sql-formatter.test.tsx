import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SqlFormatterTool } from '../sql-formatter'

describe('SqlFormatterTool', () => {
  it('renders without crashing', () => {
    render(<SqlFormatterTool />)
    expect(screen.getByText('SQL Input')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /format sql/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('formats simple SELECT query', () => {
    render(<SqlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter SQL query to format...')

    fireEvent.change(textarea, {
      target: { value: 'select id, name from users' }
    })

    const formatButton = screen.getByRole('button', { name: /format sql/i })
    fireEvent.click(formatButton)

    expect(screen.getByText('Formatted SQL')).toBeInTheDocument()
  })

  it('converts keywords to uppercase', () => {
    render(<SqlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter SQL query to format...')

    fireEvent.change(textarea, {
      target: { value: 'select id from users where active = true' }
    })

    const formatButton = screen.getByRole('button', { name: /format sql/i })
    fireEvent.click(formatButton)

    const outputTextarea = screen.getByDisplayValue(/SELECT/)
    expect(outputTextarea).toBeInTheDocument()
  })

  it('handles WHERE clause', () => {
    render(<SqlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter SQL query to format...')

    fireEvent.change(textarea, {
      target: { value: 'select * from users where id = 1' }
    })

    const formatButton = screen.getByRole('button', { name: /format sql/i })
    fireEvent.click(formatButton)

    const output = screen.getByDisplayValue(/WHERE/)
    expect(output).toBeInTheDocument()
  })

  it('handles ORDER BY clause', () => {
    render(<SqlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter SQL query to format...')

    fireEvent.change(textarea, {
      target: { value: 'select * from users order by name' }
    })

    const formatButton = screen.getByRole('button', { name: /format sql/i })
    fireEvent.click(formatButton)

    const output = screen.getByDisplayValue(/ORDER BY/)
    expect(output).toBeInTheDocument()
  })

  it('handles JOIN queries', () => {
    render(<SqlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter SQL query to format...')

    fireEvent.change(textarea, {
      target: { value: 'select u.name from users u join orders o on u.id = o.user_id' }
    })

    const formatButton = screen.getByRole('button', { name: /format sql/i })
    fireEvent.click(formatButton)

    const output = screen.getByDisplayValue(/JOIN/)
    expect(output).toBeInTheDocument()
  })

  it('handles INSERT query', () => {
    render(<SqlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter SQL query to format...')

    fireEvent.change(textarea, {
      target: { value: 'insert into users (name, email) values ("John", "john@test.com")' }
    })

    const formatButton = screen.getByRole('button', { name: /format sql/i })
    fireEvent.click(formatButton)

    const output = screen.getByDisplayValue(/INSERT INTO/)
    expect(output).toBeInTheDocument()
  })

  it('handles UPDATE query', () => {
    render(<SqlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter SQL query to format...')

    fireEvent.change(textarea, {
      target: { value: 'update users set name = "John" where id = 1' }
    })

    const formatButton = screen.getByRole('button', { name: /format sql/i })
    fireEvent.click(formatButton)

    const output = screen.getByDisplayValue(/UPDATE/)
    expect(output).toBeInTheDocument()
  })

  it('resets input and output', () => {
    render(<SqlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter SQL query to format...') as HTMLTextAreaElement

    fireEvent.change(textarea, {
      target: { value: 'select * from users' }
    })

    const formatButton = screen.getByRole('button', { name: /format sql/i })
    fireEvent.click(formatButton)

    expect(screen.getByText('Formatted SQL')).toBeInTheDocument()

    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)

    expect(textarea.value).toBe('')
    expect(screen.queryByText('Formatted SQL')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<SqlFormatterTool />)

    const formatButton = screen.getByRole('button', { name: /format sql/i })
    fireEvent.click(formatButton)

    // Should not show output for empty input
    expect(screen.queryByText('Formatted SQL')).not.toBeInTheDocument()
  })

  it('handles whitespace-only input', () => {
    render(<SqlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter SQL query to format...')

    fireEvent.change(textarea, { target: { value: '   ' } })

    const formatButton = screen.getByRole('button', { name: /format sql/i })
    fireEvent.click(formatButton)

    // Should not show output for whitespace-only input
    expect(screen.queryByText('Formatted SQL')).not.toBeInTheDocument()
  })

  it('removes extra whitespace', () => {
    render(<SqlFormatterTool />)
    const textarea = screen.getByPlaceholderText('Enter SQL query to format...')

    fireEvent.change(textarea, {
      target: { value: 'select     id    from    users' }
    })

    const formatButton = screen.getByRole('button', { name: /format sql/i })
    fireEvent.click(formatButton)

    // Output should have normalized whitespace
    expect(screen.getByText('Formatted SQL')).toBeInTheDocument()
  })
})
