import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BlockTimestampConverterTool } from '../block-timestamp-converter'

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />
}))

describe('BlockTimestampConverterTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<BlockTimestampConverterTool />)
    expect(screen.getByText('Select Chain')).toBeInTheDocument()
  })

  it('renders chain selection buttons', () => {
    render(<BlockTimestampConverterTool />)
    expect(screen.getByText('Ethereum')).toBeInTheDocument()
    expect(screen.getByText('Polygon')).toBeInTheDocument()
    expect(screen.getByText('BSC')).toBeInTheDocument()
  })

  it('renders conversion mode buttons', () => {
    render(<BlockTimestampConverterTool />)
    expect(screen.getByText('Conversion Mode')).toBeInTheDocument()
  })

  it('shows block to time mode by default', () => {
    render(<BlockTimestampConverterTool />)
    expect(screen.getAllByText(/Block Number/i).length).toBeGreaterThan(0)
  })

  it('switches to time to block mode', () => {
    render(<BlockTimestampConverterTool />)
    const timeToBlockButton = screen.getByText(/Timestamp → Block/i)
    fireEvent.click(timeToBlockButton)
    expect(screen.getAllByText(/Target Timestamp/i).length).toBeGreaterThan(0)
  })

  it('has reference point section', () => {
    render(<BlockTimestampConverterTool />)
    expect(screen.getAllByText(/Reference Point/i).length).toBeGreaterThan(0)
  })

  it('has convert button', () => {
    render(<BlockTimestampConverterTool />)
    expect(screen.getAllByRole('button', { name: /convert/i }).length).toBeGreaterThan(0)
  })

  it('has reset button', () => {
    render(<BlockTimestampConverterTool />)
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('selects different chains', () => {
    render(<BlockTimestampConverterTool />)
    const polygonButton = screen.getByText('Polygon')
    fireEvent.click(polygonButton)
    expect(screen.getAllByText(/~2s\/block/i).length).toBeGreaterThan(0)
  })

  it('displays info box about block times', () => {
    render(<BlockTimestampConverterTool />)
    expect(screen.getByText(/How it works:/i)).toBeInTheDocument()
  })
})
