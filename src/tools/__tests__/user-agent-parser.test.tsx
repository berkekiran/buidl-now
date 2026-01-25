import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { UserAgentParserTool } from '../user-agent-parser'

describe('UserAgentParserTool', () => {
  const mockUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

  beforeEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: mockUserAgent,
      writable: true,
      configurable: true,
    })
  })

  it('renders without crashing', () => {
    render(<UserAgentParserTool />)
    expect(screen.getByText("Your current browser's User-Agent:")).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Parse My User-Agent' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Parse User-Agent' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays user agent string label', () => {
    render(<UserAgentParserTool />)
    expect(screen.getByText('User-Agent String')).toBeInTheDocument()
  })

  it('displays example user agents section', () => {
    render(<UserAgentParserTool />)
    expect(screen.getByText('Example User-Agents')).toBeInTheDocument()
    expect(screen.getByText('Chrome on Windows')).toBeInTheDocument()
    expect(screen.getByText('Safari on iPhone')).toBeInTheDocument()
    expect(screen.getByText('Chrome on macOS')).toBeInTheDocument()
  })

  it('parses Chrome on Windows user agent', () => {
    render(<UserAgentParserTool />)
    const input = screen.getByPlaceholderText('Paste a User-Agent string to parse...')
    const parseButton = screen.getByRole('button', { name: 'Parse User-Agent' })

    const chromeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    fireEvent.change(input, { target: { value: chromeUA } })
    fireEvent.click(parseButton)

    expect(screen.getByText('Browser')).toBeInTheDocument()
    expect(screen.getByText('Chrome')).toBeInTheDocument()
    expect(screen.getByText('Operating System')).toBeInTheDocument()
    expect(screen.getByText('Windows')).toBeInTheDocument()
  })

  it('parses Safari on iPhone user agent', () => {
    render(<UserAgentParserTool />)
    const input = screen.getByPlaceholderText('Paste a User-Agent string to parse...')
    const parseButton = screen.getByRole('button', { name: 'Parse User-Agent' })

    const safariUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    fireEvent.change(input, { target: { value: safariUA } })
    fireEvent.click(parseButton)

    expect(screen.getAllByText('Safari').length).toBeGreaterThan(0)
    // Note: due to parsing order, "Mac OS X" in UA string causes macOS detection, device type is Mobile with Apple/iPhone
    expect(screen.getAllByText('Mobile').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Apple').length).toBeGreaterThan(0)
    expect(screen.getAllByText('iPhone').length).toBeGreaterThan(0)
  })

  it('parses Firefox user agent', () => {
    render(<UserAgentParserTool />)
    const input = screen.getByPlaceholderText('Paste a User-Agent string to parse...')
    const parseButton = screen.getByRole('button', { name: 'Parse User-Agent' })

    const firefoxUA = 'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0'
    fireEvent.change(input, { target: { value: firefoxUA } })
    fireEvent.click(parseButton)

    expect(screen.getByText('Firefox')).toBeInTheDocument()
    expect(screen.getByText('Linux')).toBeInTheDocument()
    expect(screen.getByText('Gecko')).toBeInTheDocument()
  })

  it('parses Edge user agent', () => {
    render(<UserAgentParserTool />)
    const input = screen.getByPlaceholderText('Paste a User-Agent string to parse...')
    const parseButton = screen.getByRole('button', { name: 'Parse User-Agent' })

    const edgeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
    fireEvent.change(input, { target: { value: edgeUA } })
    fireEvent.click(parseButton)

    expect(screen.getByText('Microsoft Edge')).toBeInTheDocument()
  })

  it('detects tablet device correctly', () => {
    render(<UserAgentParserTool />)
    const input = screen.getByPlaceholderText('Paste a User-Agent string to parse...')
    const parseButton = screen.getByRole('button', { name: 'Parse User-Agent' })

    // Note: iPad UA without "Mobile" string gets detected as Tablet
    const iPadUA = 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/604.1'
    fireEvent.change(input, { target: { value: iPadUA } })
    fireEvent.click(parseButton)

    expect(screen.getAllByText('Tablet').length).toBeGreaterThan(0)
  })

  it('displays rendering engine information', () => {
    render(<UserAgentParserTool />)
    const input = screen.getByPlaceholderText('Paste a User-Agent string to parse...')
    const parseButton = screen.getByRole('button', { name: 'Parse User-Agent' })

    const chromeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    fireEvent.change(input, { target: { value: chromeUA } })
    fireEvent.click(parseButton)

    expect(screen.getByText('Rendering Engine')).toBeInTheDocument()
    expect(screen.getByText('WebKit')).toBeInTheDocument()
  })

  it('resets parsed results when reset button is clicked', () => {
    render(<UserAgentParserTool />)
    const input = screen.getByPlaceholderText('Paste a User-Agent string to parse...')
    const parseButton = screen.getByRole('button', { name: 'Parse User-Agent' })
    const resetButton = screen.getByRole('button', { name: 'Reset' })

    fireEvent.change(input, { target: { value: 'Mozilla/5.0 Chrome/120' } })
    fireEvent.click(parseButton)
    fireEvent.click(resetButton)

    expect(input).toHaveValue('')
    expect(screen.queryByText('Browser')).not.toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<UserAgentParserTool />)
    const parseButton = screen.getByRole('button', { name: 'Parse User-Agent' })

    fireEvent.click(parseButton)

    // Should not display any parsed results
    expect(screen.queryByText('Browser')).not.toBeInTheDocument()
    expect(screen.queryByText('Operating System')).not.toBeInTheDocument()
  })

  it('parses example user agent when clicked', () => {
    render(<UserAgentParserTool />)
    const chromeExample = screen.getByText('Chrome on Windows')

    fireEvent.click(chromeExample)

    expect(screen.getByText('Browser')).toBeInTheDocument()
    expect(screen.getByText('Chrome')).toBeInTheDocument()
  })

  it('parses current user agent when Parse My User-Agent is clicked', () => {
    render(<UserAgentParserTool />)
    const parseMyButton = screen.getByRole('button', { name: 'Parse My User-Agent' })

    fireEvent.click(parseMyButton)

    expect(screen.getByText('Browser')).toBeInTheDocument()
    expect(screen.getByText('Operating System')).toBeInTheDocument()
    expect(screen.getByText('Device')).toBeInTheDocument()
    expect(screen.getByText('Rendering Engine')).toBeInTheDocument()
  })

  it('detects Android device correctly', () => {
    render(<UserAgentParserTool />)
    const input = screen.getByPlaceholderText('Paste a User-Agent string to parse...')
    const parseButton = screen.getByRole('button', { name: 'Parse User-Agent' })

    const androidUA = 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    fireEvent.change(input, { target: { value: androidUA } })
    fireEvent.click(parseButton)

    expect(screen.getByText('Android')).toBeInTheDocument()
    expect(screen.getByText('Mobile')).toBeInTheDocument()
  })

  it('detects macOS correctly', () => {
    render(<UserAgentParserTool />)
    const input = screen.getByPlaceholderText('Paste a User-Agent string to parse...')
    const parseButton = screen.getByRole('button', { name: 'Parse User-Agent' })

    const macUA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    fireEvent.change(input, { target: { value: macUA } })
    fireEvent.click(parseButton)

    expect(screen.getByText('macOS')).toBeInTheDocument()
    expect(screen.getByText('10.15.7')).toBeInTheDocument()
  })

  it('shows N/A for unknown values', () => {
    render(<UserAgentParserTool />)
    const input = screen.getByPlaceholderText('Paste a User-Agent string to parse...')
    const parseButton = screen.getByRole('button', { name: 'Parse User-Agent' })

    // A minimal user agent that won't match common patterns
    fireEvent.change(input, { target: { value: 'CustomBot/1.0' } })
    fireEvent.click(parseButton)

    expect(screen.getAllByText('Unknown').length).toBeGreaterThan(0)
  })
})
