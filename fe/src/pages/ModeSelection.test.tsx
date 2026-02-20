import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ToastProvider } from '../context/ToastContext'
import ModeSelection from './ModeSelection'
import * as apis from '../apis'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>()
    return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../apis', () => ({
    createSingleGame: vi.fn(),
    createDoubleGame: vi.fn(),
    joinGame: vi.fn(),
    getAvailableGames: vi.fn(),
    getScores: vi.fn(),
    addScore: vi.fn(),
}))

function renderPage() {
    return render(
        <MemoryRouter>
            <ToastProvider>
                <ModeSelection />
            </ToastProvider>
        </MemoryRouter>
    )
}

beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apis.createSingleGame).mockResolvedValue(undefined)
    vi.mocked(apis.createDoubleGame).mockResolvedValue(undefined)
    vi.mocked(apis.getAvailableGames).mockResolvedValue([])
    vi.mocked(apis.joinGame).mockResolvedValue({ success: true })
})

describe('ModeSelection', () => {
    it('renders the page heading', () => {
        renderPage()
        expect(screen.getByText(/space shooter/i)).toBeInTheDocument()
    })

    it('renders Single Player, Create Multiplayer, and Find Multiplayer buttons', () => {
        renderPage()
        expect(screen.getByRole('button', { name: /single player/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /create multiplayer game/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /find multiplayer game/i })).toBeInTheDocument()
    })

    it('calls createSingleGame and navigates to /single on Single Player click', async () => {
        const user = userEvent.setup()
        renderPage()
        await user.click(screen.getByRole('button', { name: /single player/i }))
        await waitFor(() => expect(apis.createSingleGame).toHaveBeenCalledOnce())
        expect(mockNavigate).toHaveBeenCalledWith('/single')
    })

    it('shows a validation error (red border) when creating multiplayer with empty name', async () => {
        const user = userEvent.setup()
        renderPage()
        await user.click(screen.getByRole('button', { name: /create multiplayer game/i }))
        const input = screen.getByPlaceholderText('Game name')
        expect(input.className).toContain('border-red-500')
        expect(apis.createDoubleGame).not.toHaveBeenCalled()
    })

    it('clears the validation error when user starts typing', async () => {
        const user = userEvent.setup()
        renderPage()
        await user.click(screen.getByRole('button', { name: /create multiplayer game/i }))
        const input = screen.getByPlaceholderText('Game name')
        expect(input.className).toContain('border-red-500')
        await user.type(input, 'A')
        expect(input.className).not.toContain('border-red-500')
    })

    it('calls createDoubleGame with the name and navigates to /double', async () => {
        const user = userEvent.setup()
        renderPage()
        await user.type(screen.getByPlaceholderText('Game name'), 'MyGame')
        await user.click(screen.getByRole('button', { name: /create multiplayer game/i }))
        await waitFor(() => expect(apis.createDoubleGame).toHaveBeenCalledWith('MyGame'))
        expect(mockNavigate).toHaveBeenCalledWith('/double')
    })

    it('calls getAvailableGames and opens modal on Find Multiplayer Game click', async () => {
        const user = userEvent.setup()
        renderPage()
        await user.click(screen.getByRole('button', { name: /find multiplayer game/i }))
        await waitFor(() => expect(apis.getAvailableGames).toHaveBeenCalledOnce())
        expect(await screen.findByText('Game Name')).toBeInTheDocument()
    })

    it('displays games in the modal when getAvailableGames returns data', async () => {
        vi.mocked(apis.getAvailableGames).mockResolvedValue([
            { name: 'Room Alpha', id: 'id-1' },
        ])
        const user = userEvent.setup()
        renderPage()
        await user.click(screen.getByRole('button', { name: /find multiplayer game/i }))
        expect(await screen.findByText('Room Alpha')).toBeInTheDocument()
    })

    it('navigates to /double when a game is joined successfully', async () => {
        vi.mocked(apis.getAvailableGames).mockResolvedValue([
            { name: 'Room Beta', id: 'id-2' },
        ])
        const user = userEvent.setup()
        renderPage()
        await user.click(screen.getByRole('button', { name: /find multiplayer game/i }))
        const joinBtn = await screen.findByRole('button', { name: /join/i })
        await user.click(joinBtn)
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/double'))
    })

    it('shows a toast error when joining a game fails', async () => {
        vi.mocked(apis.getAvailableGames).mockResolvedValue([
            { name: 'Full Room', id: 'id-3' },
        ])
        vi.mocked(apis.joinGame).mockResolvedValue({ success: false, message: 'Room is full' })
        const user = userEvent.setup()
        renderPage()
        await user.click(screen.getByRole('button', { name: /find multiplayer game/i }))
        const joinBtn = await screen.findByRole('button', { name: /join/i })
        await user.click(joinBtn)
        expect(await screen.findByText('Room is full')).toBeInTheDocument()
    })
})
