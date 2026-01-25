import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HttpStatusTool } from '../http-status'

describe('HttpStatusTool', () => {
  it('renders without crashing', () => {
    render(<HttpStatusTool />)
    expect(screen.getByText('Search Status Codes')).toBeInTheDocument()
    expect(screen.getByText('Filter by Category')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset Filters' })).toBeInTheDocument()
  })

  it('displays category filter buttons', () => {
    render(<HttpStatusTool />)
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1xx Informational' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2xx Success' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3xx Redirection' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '4xx Client Error' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '5xx Server Error' })).toBeInTheDocument()
  })

  it('shows all status codes by default', () => {
    render(<HttpStatusTool />)
    // Check for some common status codes
    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByText('OK')).toBeInTheDocument()
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByText('Not Found')).toBeInTheDocument()
  })

  it('filters by search term', () => {
    render(<HttpStatusTool />)
    const searchInput = screen.getByPlaceholderText('Search by code, name, or description...')

    fireEvent.change(searchInput, { target: { value: '404' } })

    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByText('Not Found')).toBeInTheDocument()
    // Other codes should not be visible
    expect(screen.queryByText('200')).not.toBeInTheDocument()
  })

  it('filters by category when category button is clicked', () => {
    render(<HttpStatusTool />)
    const successButton = screen.getByRole('button', { name: '2xx Success' })

    fireEvent.click(successButton)

    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByText('201')).toBeInTheDocument()
    // 4xx codes should not be visible
    expect(screen.queryByText('404')).not.toBeInTheDocument()
  })

  it('expands status code details when clicked', () => {
    render(<HttpStatusTool />)
    const statusCode200 = screen.getByText('200').closest('div[class*="cursor-pointer"]')

    if (statusCode200) {
      fireEvent.click(statusCode200)
    }

    // Description should be visible after expanding
    expect(screen.getByText(/The request has succeeded/)).toBeInTheDocument()
  })

  it('collapses status code details when clicked again', () => {
    render(<HttpStatusTool />)
    const statusCode200Container = screen.getByText('200').closest('div[class*="cursor-pointer"]')

    if (statusCode200Container) {
      // Expand
      fireEvent.click(statusCode200Container)
      expect(screen.getByText(/The request has succeeded/)).toBeInTheDocument()

      // Collapse
      fireEvent.click(statusCode200Container)
      expect(screen.queryByText(/The request has succeeded/)).not.toBeInTheDocument()
    }
  })

  it('resets filters when reset button is clicked', () => {
    render(<HttpStatusTool />)
    const searchInput = screen.getByPlaceholderText('Search by code, name, or description...')
    const clientErrorButton = screen.getByRole('button', { name: '4xx Client Error' })
    const resetButton = screen.getByRole('button', { name: 'Reset Filters' })

    fireEvent.change(searchInput, { target: { value: '404' } })
    fireEvent.click(clientErrorButton)
    fireEvent.click(resetButton)

    expect(searchInput).toHaveValue('')
    // All codes should be visible again
    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('displays results count', () => {
    render(<HttpStatusTool />)
    // The text should indicate showing X of Y status codes
    expect(screen.getByText(/Showing \d+ of \d+ status codes/)).toBeInTheDocument()
  })

  it('shows no results message when search has no matches', () => {
    render(<HttpStatusTool />)
    const searchInput = screen.getByPlaceholderText('Search by code, name, or description...')

    fireEvent.change(searchInput, { target: { value: 'nonexistent999' } })

    expect(screen.getByText('No status codes found matching your search.')).toBeInTheDocument()
  })

  it('searches by status code name', () => {
    render(<HttpStatusTool />)
    const searchInput = screen.getByPlaceholderText('Search by code, name, or description...')

    fireEvent.change(searchInput, { target: { value: 'Forbidden' } })

    expect(screen.getByText('403')).toBeInTheDocument()
    expect(screen.getByText('Forbidden')).toBeInTheDocument()
  })

  it('searches by description', () => {
    render(<HttpStatusTool />)
    const searchInput = screen.getByPlaceholderText('Search by code, name, or description...')

    fireEvent.change(searchInput, { target: { value: 'teapot' } })

    expect(screen.getByText('418')).toBeInTheDocument()
    expect(screen.getByText("I'm a Teapot")).toBeInTheDocument()
  })

  it('displays 5xx server error codes correctly', () => {
    render(<HttpStatusTool />)
    const serverErrorButton = screen.getByRole('button', { name: '5xx Server Error' })

    fireEvent.click(serverErrorButton)

    expect(screen.getByText('500')).toBeInTheDocument()
    expect(screen.getByText('Internal Server Error')).toBeInTheDocument()
    expect(screen.getByText('502')).toBeInTheDocument()
    expect(screen.getByText('Bad Gateway')).toBeInTheDocument()
  })

  it('displays 3xx redirection codes correctly', () => {
    render(<HttpStatusTool />)
    const redirectionButton = screen.getByRole('button', { name: '3xx Redirection' })

    fireEvent.click(redirectionButton)

    expect(screen.getByText('301')).toBeInTheDocument()
    expect(screen.getByText('Moved Permanently')).toBeInTheDocument()
    expect(screen.getByText('302')).toBeInTheDocument()
    expect(screen.getByText('Found')).toBeInTheDocument()
  })
})
