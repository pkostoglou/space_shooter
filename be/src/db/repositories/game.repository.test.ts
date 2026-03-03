import { describe, it, expect } from 'vitest'
import { createGameRepository } from './game.repository.js'
import { Game } from '../models/index.js'

const repo = createGameRepository()

describe('GameRepository: saveScore', () => {
    it('persists a score to the database with gameType', async () => {
        await repo.saveScore('Alice', 500, 'single')

        const docs = await Game.find()
        expect(docs).toHaveLength(1)
        expect(docs[0]!.name).toBe('Alice')
        expect(docs[0]!.score).toBe(500)
        expect(docs[0]!.gameType).toBe('single')
    })

    it('returns rank 1 for the first score', async () => {
        const { rank } = await repo.saveScore('Alice', 500, 'single')
        expect(rank).toBe(1)
    })

    it('returns correct rank when other scores exist', async () => {
        await Game.create({ name: 'Top', score: 9000, gameType: 'single' })
        await Game.create({ name: 'Mid', score: 5000, gameType: 'single' })

        const { rank } = await repo.saveScore('New', 3000, 'single')
        expect(rank).toBe(3)
    })

    it('handles tied scores', async () => {
        await Game.create({ name: 'First', score: 500, gameType: 'single' })

        const { rank } = await repo.saveScore('Second', 500, 'single')
        expect(rank).toBe(1)
    })

    it('ranks only within the same gameType', async () => {
        await Game.create({ name: 'SingleTop', score: 9000, gameType: 'single' })
        await Game.create({ name: 'DoubleTop', score: 8000, gameType: 'double' })

        const { rank } = await repo.saveScore('NewDouble', 5000, 'double')
        expect(rank).toBe(2)
    })
})

describe('GameRepository: getLeaderboard', () => {
    it('returns an empty array when no scores exist', async () => {
        const games = await repo.getLeaderboard('single')
        expect(games).toHaveLength(0)
    })

    it('returns games sorted by score descending', async () => {
        await Game.create({ name: 'Alice', score: 100, gameType: 'single' })
        await Game.create({ name: 'Bob', score: 500, gameType: 'single' })
        await Game.create({ name: 'Carol', score: 250, gameType: 'single' })

        const games = await repo.getLeaderboard('single')
        expect(games[0]!.score).toBe(500)
        expect(games[1]!.score).toBe(250)
        expect(games[2]!.score).toBe(100)
    })

    it('limits results to 20 entries', async () => {
        const docs = Array.from({ length: 25 }, (_, i) => ({
            name: `Player ${i}`,
            score: i * 10,
            gameType: 'single' as const,
        }))
        await Game.insertMany(docs)

        const games = await repo.getLeaderboard('single')
        expect(games).toHaveLength(20)
    })

    it('filters by gameType', async () => {
        await Game.create({ name: 'Solo', score: 100, gameType: 'single' })
        await Game.create({ name: 'Team', score: 200, gameType: 'double' })
        await Game.create({ name: 'Solo2', score: 300, gameType: 'single' })

        const singles = await repo.getLeaderboard('single')
        expect(singles).toHaveLength(2)
        expect(singles[0]!.name).toBe('Solo2')
        expect(singles[1]!.name).toBe('Solo')

        const doubles = await repo.getLeaderboard('double')
        expect(doubles).toHaveLength(1)
        expect(doubles[0]!.name).toBe('Team')
    })
})
