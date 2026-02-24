import { describe, it, expect } from 'vitest'
import { createGameRepository } from './game.repository.js'
import { Game } from '../models/index.js'

const repo = createGameRepository()

describe('GameRepository: saveScore', () => {
    it('persists a score to the database', async () => {
        await repo.saveScore('Alice', 500)

        const docs = await Game.find()
        expect(docs).toHaveLength(1)
        expect(docs[0].name).toBe('Alice')
        expect(docs[0].score).toBe(500)
    })

    it('returns rank 1 for the first score', async () => {
        const { rank } = await repo.saveScore('Alice', 500)
        expect(rank).toBe(1)
    })

    it('returns correct rank when other scores exist', async () => {
        await Game.create({ name: 'Top', score: 9000 })
        await Game.create({ name: 'Mid', score: 5000 })

        const { rank } = await repo.saveScore('New', 3000)
        expect(rank).toBe(3)
    })

    it('handles tied scores', async () => {
        await Game.create({ name: 'First', score: 500 })

        const { rank } = await repo.saveScore('Second', 500)
        expect(rank).toBe(1)
    })
})

describe('GameRepository: getLeaderboard', () => {
    it('returns an empty array when no scores exist', async () => {
        const games = await repo.getLeaderboard()
        expect(games).toHaveLength(0)
    })

    it('returns games sorted by score descending', async () => {
        await Game.create({ name: 'Alice', score: 100 })
        await Game.create({ name: 'Bob', score: 500 })
        await Game.create({ name: 'Carol', score: 250 })

        const games = await repo.getLeaderboard()
        expect(games[0].score).toBe(500)
        expect(games[1].score).toBe(250)
        expect(games[2].score).toBe(100)
    })

    it('limits results to 20 entries', async () => {
        const docs = Array.from({ length: 25 }, (_, i) => ({
            name: `Player ${i}`,
            score: i * 10,
        }))
        await Game.insertMany(docs)

        const games = await repo.getLeaderboard()
        expect(games).toHaveLength(20)
    })
})
