import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScoreModal from './ScoreModal'

vi.mock('../apis', () => ({
    getScores: vi.fn().mockResolvedValue([]),
}))

function renderModal(overrides?: {
    isOpen?: boolean
    score?: number
    onSave?: (name: string) => Promise<number | null>
    onRestart?: () => void
}) {
    const props = {
        isOpen: true,
        score: 1500,
        onSave: vi.fn().mockResolvedValue(null),
        onRestart: vi.fn(),
        ...overrides,
    }
    return { ...render(<ScoreModal {...props} />), props }
}

describe('ScoreModal', () => {
    it('renders nothing when isOpen is false', () => {
        renderModal({ isOpen: false })
        expect(screen.queryByText('Game Over!')).not.toBeInTheDocument()
    })

    it('renders "Game Over!" heading when open', () => {
        renderModal()
        expect(screen.getByText('Game Over!')).toBeInTheDocument()
    })

    it('displays the current score', () => {
        renderModal({ score: 3200 })
        expect(screen.getByText('3200')).toBeInTheDocument()
    })

    it('submit button is disabled when name is empty', () => {
        renderModal()
        expect(screen.getByRole('button', { name: /save score/i })).toBeDisabled()
    })

    it('submit button is enabled when name is entered', async () => {
        const user = userEvent.setup()
        renderModal()
        await user.type(screen.getByPlaceholderText('Enter your name'), 'Alice')
        expect(screen.getByRole('button', { name: /save score/i })).toBeEnabled()
    })

    it('calls onSave with the trimmed name on submit', async () => {
        const onSave = vi.fn().mockResolvedValue(null)
        const user = userEvent.setup()
        renderModal({ onSave })
        await user.type(screen.getByPlaceholderText('Enter your name'), '  Alice  ')
        await user.click(screen.getByRole('button', { name: /save score/i }))
        expect(onSave).toHaveBeenCalledWith('Alice')
    })

    it('shows the rank after saving', async () => {
        const onSave = vi.fn().mockResolvedValue(5)
        const user = userEvent.setup()
        renderModal({ onSave })
        await user.type(screen.getByPlaceholderText('Enter your name'), 'Bob')
        await user.click(screen.getByRole('button', { name: /save score/i }))
        await waitFor(() => expect(screen.getByText('#5')).toBeInTheDocument())
    })

    it('disables save button after score is saved', async () => {
        const onSave = vi.fn().mockResolvedValue(1)
        const user = userEvent.setup()
        renderModal({ onSave })
        await user.type(screen.getByPlaceholderText('Enter your name'), 'Carol')
        await user.click(screen.getByRole('button', { name: /save score/i }))
        await waitFor(() =>
            expect(screen.getByRole('button', { name: /score saved/i })).toBeDisabled()
        )
    })

    it('calls onRestart when Restart Game button is clicked', async () => {
        const onRestart = vi.fn()
        const user = userEvent.setup()
        renderModal({ onRestart })
        await user.click(screen.getByRole('button', { name: /restart game/i }))
        expect(onRestart).toHaveBeenCalledOnce()
    })

    it('switches to leaderboard view when Leaderboards button is clicked', async () => {
        const user = userEvent.setup()
        renderModal()
        await user.click(screen.getByRole('button', { name: /leaderboards/i }))
        await waitFor(() => expect(screen.getByText('Rank')).toBeInTheDocument())
    })
})

describe('ScoreModal — back button', () => {
    beforeEach(() => vi.clearAllMocks())

    it('returns to actions view when back button is clicked from leaderboard', async () => {
        const user = userEvent.setup()
        renderModal()
        await user.click(screen.getByRole('button', { name: /leaderboards/i }))
        await waitFor(() => expect(screen.getByText('Rank')).toBeInTheDocument())

        // The back button contains ← (arrow)
        const backBtn = screen.getByRole('button', { name: /←/ })
        await user.click(backBtn)
        expect(screen.getByText('Game Over!')).toBeInTheDocument()
    })
})
