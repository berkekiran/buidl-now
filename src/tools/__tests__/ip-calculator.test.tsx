import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { IpCalculatorTool } from '../ip-calculator'

describe('IpCalculatorTool', () => {
  it('renders without crashing', () => {
    render(<IpCalculatorTool />)
    expect(screen.getByText('IP Address')).toBeInTheDocument()
    expect(screen.getByText('CIDR Prefix (optional)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Calculate' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays input placeholder text', () => {
    render(<IpCalculatorTool />)
    expect(screen.getByPlaceholderText('192.168.1.100 or 192.168.1.100/24')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('24')).toBeInTheDocument()
  })

  it('calculates subnet information for valid IP', () => {
    render(<IpCalculatorTool />)
    const ipInput = screen.getByPlaceholderText('192.168.1.100 or 192.168.1.100/24')
    const calculateButton = screen.getByRole('button', { name: 'Calculate' })

    fireEvent.change(ipInput, { target: { value: '192.168.1.100/24' } })
    fireEvent.click(calculateButton)

    expect(screen.getByText('Network Information')).toBeInTheDocument()
    expect(screen.getByText('192.168.1.0')).toBeInTheDocument() // Network Address
    expect(screen.getByText('255.255.255.0')).toBeInTheDocument() // Subnet Mask
    expect(screen.getByText('192.168.1.255')).toBeInTheDocument() // Broadcast Address
  })

  it('calculates host range correctly', () => {
    render(<IpCalculatorTool />)
    const ipInput = screen.getByPlaceholderText('192.168.1.100 or 192.168.1.100/24')
    const calculateButton = screen.getByRole('button', { name: 'Calculate' })

    fireEvent.change(ipInput, { target: { value: '192.168.1.100/24' } })
    fireEvent.click(calculateButton)

    expect(screen.getByText('Host Range')).toBeInTheDocument()
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument() // First Host
    expect(screen.getByText('192.168.1.254')).toBeInTheDocument() // Last Host
    expect(screen.getByText('254')).toBeInTheDocument() // Usable Hosts
  })

  it('shows IP class information', () => {
    render(<IpCalculatorTool />)
    const ipInput = screen.getByPlaceholderText('192.168.1.100 or 192.168.1.100/24')
    const calculateButton = screen.getByRole('button', { name: 'Calculate' })

    fireEvent.change(ipInput, { target: { value: '192.168.1.100/24' } })
    fireEvent.click(calculateButton)

    expect(screen.getByText('Class C')).toBeInTheDocument()
  })

  it('shows address type for private IP', () => {
    render(<IpCalculatorTool />)
    const ipInput = screen.getByPlaceholderText('192.168.1.100 or 192.168.1.100/24')
    const calculateButton = screen.getByRole('button', { name: 'Calculate' })

    fireEvent.change(ipInput, { target: { value: '192.168.1.100/24' } })
    fireEvent.click(calculateButton)

    expect(screen.getByText('Address Type')).toBeInTheDocument()
    expect(screen.getByText('Private (192.168.0.0/16)')).toBeInTheDocument()
  })

  it('shows binary representation', () => {
    render(<IpCalculatorTool />)
    const ipInput = screen.getByPlaceholderText('192.168.1.100 or 192.168.1.100/24')
    const calculateButton = screen.getByRole('button', { name: 'Calculate' })

    fireEvent.change(ipInput, { target: { value: '192.168.1.100/24' } })
    fireEvent.click(calculateButton)

    expect(screen.getByText('Binary Representation')).toBeInTheDocument()
  })

  it('uses default CIDR /24 when not specified', () => {
    render(<IpCalculatorTool />)
    const ipInput = screen.getByPlaceholderText('192.168.1.100 or 192.168.1.100/24')
    const calculateButton = screen.getByRole('button', { name: 'Calculate' })

    fireEvent.change(ipInput, { target: { value: '192.168.1.100' } })
    fireEvent.click(calculateButton)

    expect(screen.getByText('192.168.1.100/24')).toBeInTheDocument()
  })

  it('uses separate CIDR input when provided', () => {
    render(<IpCalculatorTool />)
    const ipInput = screen.getByPlaceholderText('192.168.1.100 or 192.168.1.100/24')
    const cidrInput = screen.getByPlaceholderText('24')
    const calculateButton = screen.getByRole('button', { name: 'Calculate' })

    fireEvent.change(ipInput, { target: { value: '10.0.0.1' } })
    fireEvent.change(cidrInput, { target: { value: '8' } })
    fireEvent.click(calculateButton)

    expect(screen.getByText('10.0.0.1/8')).toBeInTheDocument()
    expect(screen.getByText('255.0.0.0')).toBeInTheDocument() // Subnet Mask for /8
  })

  it('shows error for invalid IP address', () => {
    render(<IpCalculatorTool />)
    const ipInput = screen.getByPlaceholderText('192.168.1.100 or 192.168.1.100/24')
    const calculateButton = screen.getByRole('button', { name: 'Calculate' })

    fireEvent.change(ipInput, { target: { value: '999.999.999.999' } })
    fireEvent.click(calculateButton)

    expect(screen.getByText('Invalid IP address format. Use format: x.x.x.x')).toBeInTheDocument()
  })

  it('shows error for empty IP input', () => {
    render(<IpCalculatorTool />)
    const calculateButton = screen.getByRole('button', { name: 'Calculate' })

    fireEvent.click(calculateButton)

    expect(screen.getByText('Please enter an IP address')).toBeInTheDocument()
  })

  it('shows error for invalid CIDR value', () => {
    render(<IpCalculatorTool />)
    const ipInput = screen.getByPlaceholderText('192.168.1.100 or 192.168.1.100/24')
    const calculateButton = screen.getByRole('button', { name: 'Calculate' })

    fireEvent.change(ipInput, { target: { value: '192.168.1.100/33' } })
    fireEvent.click(calculateButton)

    expect(screen.getByText('CIDR must be between 0 and 32')).toBeInTheDocument()
  })

  it('resets all fields when reset button is clicked', () => {
    render(<IpCalculatorTool />)
    const ipInput = screen.getByPlaceholderText('192.168.1.100 or 192.168.1.100/24')
    const calculateButton = screen.getByRole('button', { name: 'Calculate' })
    const resetButton = screen.getByRole('button', { name: 'Reset' })

    fireEvent.change(ipInput, { target: { value: '192.168.1.100/24' } })
    fireEvent.click(calculateButton)
    fireEvent.click(resetButton)

    expect(ipInput).toHaveValue('')
    expect(screen.queryByText('Network Information')).not.toBeInTheDocument()
  })

  it('calculates Class A private network correctly', () => {
    render(<IpCalculatorTool />)
    const ipInput = screen.getByPlaceholderText('192.168.1.100 or 192.168.1.100/24')
    const calculateButton = screen.getByRole('button', { name: 'Calculate' })

    fireEvent.change(ipInput, { target: { value: '10.0.0.1/8' } })
    fireEvent.click(calculateButton)

    expect(screen.getByText('Class A')).toBeInTheDocument()
    expect(screen.getByText('Private (10.0.0.0/8)')).toBeInTheDocument()
  })

  it('detects loopback address', () => {
    render(<IpCalculatorTool />)
    const ipInput = screen.getByPlaceholderText('192.168.1.100 or 192.168.1.100/24')
    const calculateButton = screen.getByRole('button', { name: 'Calculate' })

    fireEvent.change(ipInput, { target: { value: '127.0.0.1/8' } })
    fireEvent.click(calculateButton)

    expect(screen.getByText('Loopback')).toBeInTheDocument()
  })

  it('calculates /30 point-to-point network', () => {
    render(<IpCalculatorTool />)
    const ipInput = screen.getByPlaceholderText('192.168.1.100 or 192.168.1.100/24')
    const calculateButton = screen.getByRole('button', { name: 'Calculate' })

    fireEvent.change(ipInput, { target: { value: '10.0.0.1/30' } })
    fireEvent.click(calculateButton)

    expect(screen.getByText('255.255.255.252')).toBeInTheDocument() // /30 subnet mask
    expect(screen.getByText('2')).toBeInTheDocument() // Usable hosts
  })
})
