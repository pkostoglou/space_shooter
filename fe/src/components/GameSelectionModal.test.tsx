import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GameSelectionModal from './GameSelectionModal'

const defaultGames = [
    { name: 'Alpha Room', id: 'id-alpha' },
    { name: 'Beta Room', id: 'id-beta' },
]

function renderModal(overrides?: {
    isOpen?: boolean
    games?: { name: string; id: string }[]
    onJoinGame?: (id: string) => void
    onRefresh?: () => void
    searchGame?: (input: string) => void
    setIsOpen?: (v: boolean) => void
}) {
    const props = {
        isOpen: true,
        games: defaultGames,
        onJoinGame: vi.fn(),
        onRefresh: vi.fn(),
        searchGame: vi.fn(),
        setIsOpen: vi.fn(),
        ...overrides,
    }
    return { ...render(<GameSelectionModal {...props} />), props }
}

describe('GameSelectionModal', () => {
    it('renders nothing when isOpen is false', () => {
        renderModal({ isOpen: false })
        expect(screen.queryByText('Game Name')).not.toBeInTheDocument()
    })

    it('renders "Game Name" and "Actions" column headers', () => {
        renderModal()
        expect(screen.getByText('Game Name')).toBeInTheDocument()
        expect(screen.getByText('Actions')).toBeInTheDocument()
    })

    it('renders all game names', async () => {
        renderModal()
        await waitFor(() => {
            expect(screen.getByText('Alpha Room')).toBeInTheDocument()
            expect(screen.getByText('Beta Room')).toBeInTheDocument()
        })
    })

    it('renders a Join button for each game', async () => {
        renderModal()
        await waitFor(() => {
            const joinButtons = screen.getAllByRole('button', { name: /join/i })
            expect(joinButtons).toHaveLength(2)
        })
    })

    it('calls onJoinGame with the correct game id when Join is clicked', async () => {
        const onJoinGame = vi.fn()
        const user = userEvent.setup()
        renderModal({ onJoinGame })
        await waitFor(() => screen.getAllByRole('button', { name: /join/i }))
        const [firstJoin] = screen.getAllByRole('button', { name: /join/i })
        await user.click(firstJoin)
        expect(onJoinGame).toHaveBeenCalledWith('id-alpha')
    })

    it('calls onRefresh when the refresh button is clicked', async () => {
        const onRefresh = vi.fn()
        const user = userEvent.setup()
        renderModal({ onRefresh })
        // Refresh button is the ⟳ button rendered by Table
        const refreshBtn = screen.getByRole('button', { name: /⟳/ })
        await user.click(refreshBtn)
        expect(onRefresh).toHaveBeenCalledOnce()
    })

    it('renders the search input with placeholder "Search by game id"', () => {
        renderModal()
        expect(screen.getByPlaceholderText('Search by game id')).toBeInTheDocument()
    })

    it('calls searchGame when user types in the search input', async () => {
        const searchGame = vi.fn()
        const user = userEvent.setup()
        renderModal({ searchGame })
        await user.type(screen.getByPlaceholderText('Search by game id'), 'abc')
        expect(searchGame).toHaveBeenCalled()
    })

    it('renders an empty table when games is empty', () => {
        renderModal({ games: [] })
        const rows = screen.getAllByRole('row')
        // Only header row
        expect(rows).toHaveLength(1)
    })
})
