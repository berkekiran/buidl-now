import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CidrCalculatorTool } from '../cidr-calculator'

describe('CidrCalculatorTool', () => {
  it('renders without crashing', () => {
    render(<CidrCalculatorTool />)
    expect(screen.getByText('CIDR to IP Range')).toBeInTheDocument()
    expect(screen.getByText('IP Range to CIDR')).toBeInTheDocument()
    expect(screen.getByText('Split CIDR into Smaller Subnets')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset All' })).toBeInTheDocument()
  })

  it('displays quick reference section', () => {
    render(<CidrCalculatorTool />)
    expect(screen.getByText('Quick Reference')).toBeInTheDocument()
    expect(screen.getByText('/8 = 16.7M hosts')).toBeInTheDocument()
    expect(screen.getByText('/16 = 65,534 hosts')).toBeInTheDocument()
    expect(screen.getByText('/24 = 254 hosts')).toBeInTheDocument()
    expect(screen.getByText('/32 = 1 host')).toBeInTheDocument()
  })

  // CIDR to Range tests
  it('converts CIDR to IP range correctly', () => {
    render(<CidrCalculatorTool />)
    const cidrInput = screen.getByPlaceholderText('192.168.1.0/24')
    const convertButton = screen.getByRole('button', { name: 'Convert to Range' })

    fireEvent.change(cidrInput, { target: { value: '192.168.1.0/24' } })
    fireEvent.click(convertButton)

    expect(screen.getByText('192.168.1.0')).toBeInTheDocument() // Start IP
    expect(screen.getByText('192.168.1.255')).toBeInTheDocument() // End IP
    expect(screen.getByText('255.255.255.0')).toBeInTheDocument() // Subnet Mask
    expect(screen.getByText('256')).toBeInTheDocument() // Total Addresses
  })

  it('shows error for invalid CIDR notation', () => {
    render(<CidrCalculatorTool />)
    const cidrInput = screen.getByPlaceholderText('192.168.1.0/24')
    const convertButton = screen.getByRole('button', { name: 'Convert to Range' })

    fireEvent.change(cidrInput, { target: { value: 'invalid' } })
    fireEvent.click(convertButton)

    expect(screen.getByText('Invalid CIDR notation. Use format: x.x.x.x/prefix')).toBeInTheDocument()
  })

  it('handles /8 CIDR block', () => {
    render(<CidrCalculatorTool />)
    const cidrInput = screen.getByPlaceholderText('192.168.1.0/24')
    const convertButton = screen.getByRole('button', { name: 'Convert to Range' })

    fireEvent.change(cidrInput, { target: { value: '10.0.0.0/8' } })
    fireEvent.click(convertButton)

    expect(screen.getByText('10.0.0.0')).toBeInTheDocument() // Start IP
    expect(screen.getByText('10.255.255.255')).toBeInTheDocument() // End IP
    expect(screen.getByText('255.0.0.0')).toBeInTheDocument() // Subnet Mask
  })

  // Range to CIDR tests
  it('converts IP range to CIDR correctly', () => {
    render(<CidrCalculatorTool />)
    const startInput = screen.getByPlaceholderText('192.168.1.0')
    const endInput = screen.getByPlaceholderText('192.168.1.255')
    const convertButton = screen.getByRole('button', { name: 'Convert to CIDR' })

    fireEvent.change(startInput, { target: { value: '192.168.1.0' } })
    fireEvent.change(endInput, { target: { value: '192.168.1.255' } })
    fireEvent.click(convertButton)

    // Check that CIDR Blocks result section appears
    expect(screen.getByText(/CIDR Blocks/)).toBeInTheDocument()
  })

  it('shows error when start or end IP is missing', () => {
    render(<CidrCalculatorTool />)
    const convertButton = screen.getByRole('button', { name: 'Convert to CIDR' })

    fireEvent.click(convertButton)

    expect(screen.getByText('Please enter both start and end IP addresses')).toBeInTheDocument()
  })

  it('handles range that requires multiple CIDR blocks', () => {
    render(<CidrCalculatorTool />)
    const startInput = screen.getByPlaceholderText('192.168.1.0')
    const endInput = screen.getByPlaceholderText('192.168.1.255')
    const convertButton = screen.getByRole('button', { name: 'Convert to CIDR' })

    // This range might need multiple CIDR blocks
    fireEvent.change(startInput, { target: { value: '192.168.0.0' } })
    fireEvent.change(endInput, { target: { value: '192.168.3.255' } })
    fireEvent.click(convertButton)

    expect(screen.getByText(/CIDR Blocks/)).toBeInTheDocument()
  })

  // Split CIDR tests
  it('splits CIDR into smaller subnets', () => {
    render(<CidrCalculatorTool />)
    const splitInput = screen.getByPlaceholderText('10.0.0.0/16')
    const prefixInput = screen.getByPlaceholderText('24')
    const splitButton = screen.getByRole('button', { name: 'Split Subnet' })

    fireEvent.change(splitInput, { target: { value: '192.168.0.0/24' } })
    fireEvent.change(prefixInput, { target: { value: '26' } })
    fireEvent.click(splitButton)

    expect(screen.getByText(/Resulting Subnets/)).toBeInTheDocument()
    // /24 split into /26 gives 4 subnets
    expect(screen.getByText(/192\.168\.0\.0\/26/)).toBeInTheDocument()
  })

  it('shows error when new prefix is smaller or equal', () => {
    render(<CidrCalculatorTool />)
    const splitInput = screen.getByPlaceholderText('10.0.0.0/16')
    const prefixInput = screen.getByPlaceholderText('24')
    const splitButton = screen.getByRole('button', { name: 'Split Subnet' })

    fireEvent.change(splitInput, { target: { value: '192.168.0.0/24' } })
    fireEvent.change(prefixInput, { target: { value: '20' } })
    fireEvent.click(splitButton)

    expect(screen.getByText('Invalid CIDR or prefix. New prefix must be larger than current prefix.')).toBeInTheDocument()
  })

  it('shows error when prefix is invalid', () => {
    render(<CidrCalculatorTool />)
    const splitInput = screen.getByPlaceholderText('10.0.0.0/16')
    const splitButton = screen.getByRole('button', { name: 'Split Subnet' })

    fireEvent.change(splitInput, { target: { value: '192.168.0.0/24' } })
    fireEvent.click(splitButton)

    expect(screen.getByText('Please enter a valid prefix length')).toBeInTheDocument()
  })

  it('resets all fields when reset button is clicked', () => {
    render(<CidrCalculatorTool />)
    const cidrInput = screen.getByPlaceholderText('192.168.1.0/24')
    const convertButton = screen.getByRole('button', { name: 'Convert to Range' })
    const resetButton = screen.getByRole('button', { name: 'Reset All' })

    fireEvent.change(cidrInput, { target: { value: '192.168.1.0/24' } })
    fireEvent.click(convertButton)
    fireEvent.click(resetButton)

    expect(cidrInput).toHaveValue('')
    // After reset, only form labels should exist, not result labels
    expect(screen.getAllByText('Start IP').length).toBe(1)
  })

  it('shows Start IP and End IP labels in result', () => {
    render(<CidrCalculatorTool />)
    const cidrInput = screen.getByPlaceholderText('192.168.1.0/24')
    const convertButton = screen.getByRole('button', { name: 'Convert to Range' })

    fireEvent.change(cidrInput, { target: { value: '10.0.0.0/24' } })
    fireEvent.click(convertButton)

    expect(screen.getAllByText('Start IP').length).toBeGreaterThan(0)
    expect(screen.getAllByText('End IP').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Subnet Mask').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Total Addresses').length).toBeGreaterThan(0)
  })

  it('handles /32 single host CIDR', () => {
    render(<CidrCalculatorTool />)
    const cidrInput = screen.getByPlaceholderText('192.168.1.0/24')
    const convertButton = screen.getByRole('button', { name: 'Convert to Range' })

    fireEvent.change(cidrInput, { target: { value: '192.168.1.100/32' } })
    fireEvent.click(convertButton)

    expect(screen.getAllByText('192.168.1.100').length).toBeGreaterThan(0) // Both start and end
    expect(screen.getAllByText('255.255.255.255').length).toBeGreaterThan(0) // /32 mask
    expect(screen.getAllByText('1').length).toBeGreaterThan(0) // 1 address
  })

  it('handles invalid IP range (start > end)', () => {
    render(<CidrCalculatorTool />)
    const startInput = screen.getByPlaceholderText('192.168.1.0')
    const endInput = screen.getByPlaceholderText('192.168.1.255')
    const convertButton = screen.getByRole('button', { name: 'Convert to CIDR' })

    fireEvent.change(startInput, { target: { value: '192.168.2.0' } })
    fireEvent.change(endInput, { target: { value: '192.168.1.0' } })
    fireEvent.click(convertButton)

    expect(screen.getByText('Invalid IP range')).toBeInTheDocument()
  })
})
