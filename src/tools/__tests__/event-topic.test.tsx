import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EventTopicTool } from '../event-topic'

describe('EventTopicTool', () => {
  it('renders without crashing', () => {
    render(<EventTopicTool />)
    expect(screen.getByText('Event Signature')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Calculate' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('displays placeholder text', () => {
    render(<EventTopicTool />)
    expect(screen.getByPlaceholderText('Transfer(address,address,uint256)')).toBeInTheDocument()
  })

  it('calculates event topic for Transfer event', () => {
    render(<EventTopicTool />)
    const input = screen.getByPlaceholderText('Transfer(address,address,uint256)')

    fireEvent.change(input, { target: { value: 'Transfer(address,address,uint256)' } })

    // Topic0 for ERC-20 Transfer event
    expect(screen.getByDisplayValue('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')).toBeInTheDocument()
  })

  it('calculates event topic for Approval event', () => {
    render(<EventTopicTool />)
    const input = screen.getByPlaceholderText('Transfer(address,address,uint256)')

    fireEvent.change(input, { target: { value: 'Approval(address,address,uint256)' } })

    // Topic0 for ERC-20 Approval event
    expect(screen.getByDisplayValue('0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925')).toBeInTheDocument()
  })

  it('clears output when input is empty', () => {
    render(<EventTopicTool />)
    const input = screen.getByPlaceholderText('Transfer(address,address,uint256)')

    fireEvent.change(input, { target: { value: 'Transfer(address,address,uint256)' } })
    expect(screen.getByDisplayValue('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')).toBeInTheDocument()

    fireEvent.change(input, { target: { value: '' } })

    const outputInputs = screen.getAllByRole('textbox').filter(
      (el) => el.getAttribute('readonly') !== null
    )
    outputInputs.forEach((el) => {
      expect(el).toHaveValue('')
    })
  })

  it('does not calculate topic for invalid signature without parentheses', () => {
    render(<EventTopicTool />)
    const input = screen.getByPlaceholderText('Transfer(address,address,uint256)')

    fireEvent.change(input, { target: { value: 'InvalidEvent' } })

    const outputInputs = screen.getAllByRole('textbox').filter(
      (el) => el.getAttribute('readonly') !== null
    )
    outputInputs.forEach((el) => {
      expect(el).toHaveValue('')
    })
  })

  it('resets all fields when reset button is clicked', () => {
    render(<EventTopicTool />)
    const input = screen.getByPlaceholderText('Transfer(address,address,uint256)')

    fireEvent.change(input, { target: { value: 'Transfer(address,address,uint256)' } })

    const resetButton = screen.getByRole('button', { name: 'Reset' })
    fireEvent.click(resetButton)

    expect(input).toHaveValue('')
  })

  it('calculate button triggers topic calculation', () => {
    render(<EventTopicTool />)
    const input = screen.getByPlaceholderText('Transfer(address,address,uint256)')
    const calculateButton = screen.getByRole('button', { name: 'Calculate' })

    fireEvent.change(input, { target: { value: 'Transfer(address,address,uint256)' } })
    fireEvent.click(calculateButton)

    expect(screen.getByDisplayValue('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')).toBeInTheDocument()
  })

  it('handles events with no parameters', () => {
    render(<EventTopicTool />)
    const input = screen.getByPlaceholderText('Transfer(address,address,uint256)')

    fireEvent.change(input, { target: { value: 'Paused()' } })

    // Should calculate hash for Paused()
    const outputInputs = screen.getAllByRole('textbox').filter(
      (el) => el.getAttribute('readonly') !== null
    )
    expect(outputInputs.some((el) => el.getAttribute('value')?.startsWith('0x'))).toBe(true)
  })
})
