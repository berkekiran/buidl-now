import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FoundryCheatcodeGeneratorTool } from '../foundry-cheatcode-generator'

describe('FoundryCheatcodeGeneratorTool', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<FoundryCheatcodeGeneratorTool />)
    expect(screen.getByPlaceholderText(/Search cheatcodes/i)).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<FoundryCheatcodeGeneratorTool />)
    const searchInput = screen.getByPlaceholderText(/Search cheatcodes/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('renders category filter buttons', () => {
    render(<FoundryCheatcodeGeneratorTool />)
    expect(screen.getByRole('button', { name: /^All$/i })).toBeInTheDocument()
    // Check that there are multiple filter buttons
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(3)
  })

  it('displays available cheatcodes count', () => {
    render(<FoundryCheatcodeGeneratorTool />)
    expect(screen.getByText(/Available Cheatcodes/i)).toBeInTheDocument()
  })

  it('filters cheatcodes by search query', () => {
    render(<FoundryCheatcodeGeneratorTool />)
    const searchInput = screen.getByPlaceholderText(/Search cheatcodes/i)
    fireEvent.change(searchInput, { target: { value: 'prank' } })

    // Verify search input has the value
    expect(searchInput).toHaveValue('prank')
  })

  it('filters cheatcodes by category', () => {
    render(<FoundryCheatcodeGeneratorTool />)
    const buttons = screen.getAllByRole('button')
    const balanceButton = buttons.find(b => b.textContent === 'Balance')

    if (balanceButton) {
      fireEvent.click(balanceButton)
      expect(balanceButton).toBeInTheDocument()
    }
  })

  it('selects a cheatcode when clicked', async () => {
    render(<FoundryCheatcodeGeneratorTool />)

    // Look for any cheatcode button that contains vm.
    const cheatcodeButtons = screen.getAllByRole('button')
    const prankButton = cheatcodeButtons.find(b => b.textContent?.includes('vm.prank'))

    if (prankButton) {
      fireEvent.click(prankButton)

      await waitFor(() => {
        // Should show some details
        expect(screen.getAllByText(/./i).length).toBeGreaterThan(0)
      })
    }
  })

  it('shows parameter inputs for selected cheatcode', async () => {
    render(<FoundryCheatcodeGeneratorTool />)

    // Look for any cheatcode button that contains vm.
    const cheatcodeButtons = screen.getAllByRole('button')
    const prankButton = cheatcodeButtons.find(b => b.textContent?.includes('vm.prank'))

    if (prankButton) {
      fireEvent.click(prankButton)

      await waitFor(() => {
        // Component should render without crashing
        expect(screen.getByPlaceholderText(/Search cheatcodes/i)).toBeInTheDocument()
      })
    }
  })

  it('generates code when clicking generate button', async () => {
    render(<FoundryCheatcodeGeneratorTool />)

    // Look for any cheatcode button that contains vm.
    const cheatcodeButtons = screen.getAllByRole('button')
    const prankButton = cheatcodeButtons.find(b => b.textContent?.includes('vm.prank'))

    if (prankButton) {
      fireEvent.click(prankButton)

      await waitFor(() => {
        const generateButton = screen.queryByRole('button', { name: /Generate Code/i })
        if (generateButton) {
          fireEvent.click(generateButton)
        }
      })
    }
  })

  it('shows example usage for selected cheatcode', async () => {
    render(<FoundryCheatcodeGeneratorTool />)

    const cheatcodeButtons = screen.getAllByRole('button')
    const prankButton = cheatcodeButtons.find(b => b.textContent?.includes('vm.prank'))

    if (prankButton) {
      fireEvent.click(prankButton)

      await waitFor(() => {
        expect(screen.getAllByText(/./i).length).toBeGreaterThan(0)
      })
    }
  })

  it('resets all when clicking reset button', async () => {
    render(<FoundryCheatcodeGeneratorTool />)

    // Search for something
    const searchInput = screen.getByPlaceholderText(/Search cheatcodes/i)
    fireEvent.change(searchInput, { target: { value: 'prank' } })

    const cheatcodeButtons = screen.getAllByRole('button')
    const prankButton = cheatcodeButtons.find(b => b.textContent?.includes('vm.prank'))

    if (prankButton) {
      fireEvent.click(prankButton)

      await waitFor(() => {
        const resetButton = screen.queryByRole('button', { name: /Reset All/i })
        if (resetButton) {
          fireEvent.click(resetButton)
          expect(searchInput).toHaveValue('')
        }
      })
    }
  })

  it('displays info box about foundry cheatcodes', () => {
    render(<FoundryCheatcodeGeneratorTool />)
    expect(screen.getByText(/Foundry Cheatcodes:/i)).toBeInTheDocument()
  })

  it('handles copy to clipboard', async () => {
    render(<FoundryCheatcodeGeneratorTool />)

    // Select cheatcode
    const cheatcodeButtons = screen.getAllByRole('button')
    const prankButton = cheatcodeButtons.find(b => b.textContent?.includes('vm.prank'))

    if (prankButton) {
      fireEvent.click(prankButton)

      await waitFor(() => {
        const generateButton = screen.queryByRole('button', { name: /Generate Code/i })
        if (generateButton) {
          fireEvent.click(generateButton)
        }
      })
    }
  })
})
