import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import { randomUUID } from 'node:crypto'
import type { UUID } from 'node:crypto'
import type { Database } from '../../domains/db.js'
import type { TGameManager } from '../../domains/gameTypes.js'
import { createApp } from '../../app.js'

// Simple in-memory mock for gameStateManager
let mockJoinResult = true
let lastCreatedID: UUID = randomUUID()

const mockManager: TGameManager = {
    createNewSingleGame: (_id: UUID): UUID => {
        lastCreatedID = randomUUID()
        return lastCreatedID
    },
    createNewDoubleGame: (_id: UUID, _name: string): UUID => {
        lastCreatedID = randomUUID()
        return lastCreatedID
    },
    joinGame: (_id1: UUID, _id2: UUID): boolean => mockJoinResult,
    getAvailableGames: (_gameID: string | undefined) => [
        { name: 'Test Game', id: randomUUID() }
    ]
}

const db: Database = {
    game: {
        saveScore: vi.fn(),
        getLeaderboard: vi.fn(),
    },
}

const app = createApp(db, mockManager, 'http://localhost:5173')

beforeEach(() => {
    vi.mocked(db.game.saveScore).mockReset()
    vi.mocked(db.game.getLeaderboard).mockReset()
})

describe('GET /api/game', () => {
    it('returns an empty array when no scores are saved', async () => {
        vi.mocked(db.game.getLeaderboard).mockResolvedValue([])

        const res = await request(app).get('/api/game')
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body).toHaveLength(0)
        expect(db.game.getLeaderboard).toHaveBeenCalled()
    })

    it('returns games from getLeaderboard', async () => {
        vi.mocked(db.game.getLeaderboard).mockResolvedValue([
            { name: 'Bob', score: 500 },
            { name: 'Carol', score: 250 },
            { name: 'Alice', score: 100 },
        ] as any)

        const res = await request(app).get('/api/game')
        expect(res.status).toBe(200)
        expect(res.body[0].score).toBe(500)
        expect(res.body[1].score).toBe(250)
        expect(res.body[2].score).toBe(100)
    })

    it('returns 500 when getLeaderboard rejects', async () => {
        vi.mocked(db.game.getLeaderboard).mockRejectedValue(new Error('DB error'))

        const res = await request(app).get('/api/game')
        expect(res.status).toBe(500)
        expect(res.body).toHaveProperty('error')
    })
})

describe('POST /api/game', () => {
    it('saves a new score and returns rank', async () => {
        vi.mocked(db.game.saveScore).mockResolvedValue({ rank: 1 })

        const res = await request(app)
            .post('/api/game')
            .send({ name: 'Alice', score: 1000 })

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('rank', 1)
        expect(res.body).toHaveProperty('message')
        expect(db.game.saveScore).toHaveBeenCalledWith('Alice', 1000)
    })

    it('returns the rank from saveScore', async () => {
        vi.mocked(db.game.saveScore).mockResolvedValue({ rank: 3 })

        const res = await request(app)
            .post('/api/game')
            .send({ name: 'New', score: 3000 })

        expect(res.status).toBe(200)
        expect(res.body.rank).toBe(3)
        expect(db.game.saveScore).toHaveBeenCalledWith('New', 3000)
    })
})

describe('POST /api/game/single', () => {
    it('returns 200 and sets httpOnly cookies', async () => {
        const res = await request(app).post('/api/game/single')
        expect(res.status).toBe(200)
        expect(res.body.message).toBe('Game created successfully')

        const cookies = res.headers['set-cookie'] as string[] | string
        expect(cookies).toBeDefined()
        const cookieStr = Array.isArray(cookies) ? cookies.join('; ') : cookies
        expect(cookieStr).toContain('userID')
        expect(cookieStr).toContain('gameID')
        expect(cookieStr).toContain('HttpOnly')
    })
})

describe('POST /api/game/double', () => {
    it('returns 200 and sets cookies for a named double game', async () => {
        const res = await request(app)
            .post('/api/game/double')
            .send({ gameName: 'Epic Duel' })

        expect(res.status).toBe(200)
        expect(res.body.message).toBe('Game created successfully')

        const cookies = res.headers['set-cookie'] as string[] | string
        expect(cookies).toBeDefined()
        const cookieStr = Array.isArray(cookies) ? cookies.join('; ') : cookies
        expect(cookieStr).toContain('userID')
        expect(cookieStr).toContain('gameID')
    })
})

describe('POST /api/game/join', () => {
    beforeEach(() => {
        mockJoinResult = true
    })

    it('returns 200 and sets cookies when join succeeds', async () => {
        const gameID = randomUUID()
        const res = await request(app)
            .post('/api/game/join')
            .send({ gameID })

        expect(res.status).toBe(200)
        expect(res.body.message).toBe('Game created successfully')

        const cookies = res.headers['set-cookie'] as string[] | string
        const cookieStr = Array.isArray(cookies) ? cookies.join('; ') : cookies
        expect(cookieStr).toContain('userID')
        expect(cookieStr).toContain('gameID')
    })

    it('returns 404 when the game is not found or is full', async () => {
        mockJoinResult = false
        const res = await request(app)
            .post('/api/game/join')
            .send({ gameID: randomUUID() })

        expect(res.status).toBe(404)
        expect(res.body.message).toBe('Game not found or is full')
    })
})

describe('GET /api/game/double', () => {
    it('returns a list of available games', async () => {
        const res = await request(app).get('/api/game/double')
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('availableGames')
        expect(Array.isArray(res.body.availableGames)).toBe(true)
    })

    it('passes the gameID query param to getAvailableGames', async () => {
        const res = await request(app).get('/api/game/double?gameID=abc')
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('availableGames')
    })
})
