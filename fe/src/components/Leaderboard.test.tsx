import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Leaderboard from './Leaderboard'

function makeEntry(name: string, score: number, index: number) {
    return {
        name,
        score,
        createdAt: new Date('2024-01-01T00:00:00').toISOString(),
        _id: `id-${index}`,
    }
}

const TOP_10 = Array.from({ length: 10 }, (_, i) =>
    makeEntry(`Player${i + 1}`, (10 - i) * 1000, i)
)

describe('Leaderboard', () => {
    it('renders the Rank, Name, Score, and Date headers', () => {
        render(<Leaderboard leaderboard={[]} />)
        expect(screen.getByText('Rank')).toBeInTheDocument()
        expect(screen.getByText('Name')).toBeInTheDocument()
        expect(screen.getByText('Score')).toBeInTheDocument()
        expect(screen.getByText('Date')).toBeInTheDocument()
    })

    it('renders player names', () => {
        render(<Leaderboard leaderboard={[makeEntry('Alice', 5000, 0), makeEntry('Bob', 3000, 1)]} />)
        expect(screen.getByText('Alice')).toBeInTheDocument()
        expect(screen.getByText('Bob')).toBeInTheDocument()
    })

    it('shows gold medal emoji for 1st place', () => {
        render(<Leaderboard leaderboard={TOP_10} />)
        expect(screen.getByText('🥇')).toBeInTheDocument()
    })

    it('shows silver medal emoji for 2nd place', () => {
        render(<Leaderboard leaderboard={TOP_10} />)
        expect(screen.getByText('🥈')).toBeInTheDocument()
    })

    it('shows bronze medal emoji for 3rd place', () => {
        render(<Leaderboard leaderboard={TOP_10} />)
        expect(screen.getByText('🥉')).toBeInTheDocument()
    })

    it('shows #4 rank label for 4th place', () => {
        render(<Leaderboard leaderboard={TOP_10} />)
        expect(screen.getByText('#4')).toBeInTheDocument()
    })

    it('limits display to 10 entries when more are provided', () => {
        const entries = Array.from({ length: 15 }, (_, i) =>
            makeEntry(`Player${i + 1}`, (15 - i) * 100, i)
        )
        render(<Leaderboard leaderboard={entries} />)
        expect(screen.queryByText('Player11')).not.toBeInTheDocument()
        expect(screen.getByText('Player10')).toBeInTheDocument()
    })

    it('renders an empty table body when leaderboard is empty', () => {
        render(<Leaderboard leaderboard={[]} />)
        const rows = screen.getAllByRole('row')
        // Only the header row
        expect(rows).toHaveLength(1)
    })
})
