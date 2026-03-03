import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getScores, addScore, createSingleGame, createDoubleGame, joinGame, getAvailableGames } from './index'

const BASE = 'http://localhost:8000/api'

function mockFetch(body: unknown, ok = true, status = 200) {
    return vi.fn().mockResolvedValue({
        ok,
        status,
        json: async () => body,
    })
}

beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => vi.unstubAllGlobals())

describe('getScores', () => {
    it('returns parsed scores on success', async () => {
        const scores = [{ name: 'Alice', score: 100 }]
        vi.stubGlobal('fetch', mockFetch(scores))
        const result = await getScores('single')
        expect(result).toEqual(scores)
    })

    it('calls the correct URL with gameType query param', async () => {
        const fetchMock = mockFetch([])
        vi.stubGlobal('fetch', fetchMock)
        await getScores('single')
        expect(fetchMock).toHaveBeenCalledWith(`${BASE}/game?gameType=single`)
    })

    it('calls with double gameType', async () => {
        const fetchMock = mockFetch([])
        vi.stubGlobal('fetch', fetchMock)
        await getScores('double')
        expect(fetchMock).toHaveBeenCalledWith(`${BASE}/game?gameType=double`)
    })

    it('returns undefined and swallows errors on failure', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))
        const result = await getScores('single')
        expect(result).toBeUndefined()
    })

    it('returns undefined when response is not ok', async () => {
        vi.stubGlobal('fetch', mockFetch({}, false, 500))
        const result = await getScores('single')
        expect(result).toBeUndefined()
    })
})

describe('addScore', () => {
    it('returns the rank on success', async () => {
        vi.stubGlobal('fetch', mockFetch({ rank: 3 }))
        const result = await addScore(500, 'Bob', 'single')
        expect(result).toBe(3)
    })

    it('calls the correct URL with POST method, credentials, and gameType', async () => {
        const fetchMock = mockFetch({ rank: 1 })
        vi.stubGlobal('fetch', fetchMock)
        await addScore(200, 'Charlie', 'single')
        expect(fetchMock).toHaveBeenCalledWith(`${BASE}/game`, expect.objectContaining({
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ score: 200, name: 'Charlie', gameType: 'single' }),
        }))
    })

    it('includes double gameType in request body', async () => {
        const fetchMock = mockFetch({ rank: 1 })
        vi.stubGlobal('fetch', fetchMock)
        await addScore(300, 'TeamA', 'double')
        expect(fetchMock).toHaveBeenCalledWith(`${BASE}/game`, expect.objectContaining({
            body: JSON.stringify({ score: 300, name: 'TeamA', gameType: 'double' }),
        }))
    })

    it('returns undefined on error', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')))
        const result = await addScore(100, 'Dave', 'single')
        expect(result).toBeUndefined()
    })
})

describe('createSingleGame', () => {
    it('calls the correct URL with POST and credentials', async () => {
        const fetchMock = mockFetch(null)
        vi.stubGlobal('fetch', fetchMock)
        await createSingleGame()
        expect(fetchMock).toHaveBeenCalledWith(`${BASE}/game/single`, expect.objectContaining({
            method: 'POST',
            credentials: 'include',
        }))
    })

    it('swallows errors silently', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')))
        await expect(createSingleGame()).resolves.toBeUndefined()
    })
})

describe('createDoubleGame', () => {
    it('calls the correct URL with the game name in the body', async () => {
        const fetchMock = mockFetch(null)
        vi.stubGlobal('fetch', fetchMock)
        await createDoubleGame('MyGame')
        expect(fetchMock).toHaveBeenCalledWith(`${BASE}/game/double`, expect.objectContaining({
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ gameName: 'MyGame' }),
        }))
    })

    it('swallows errors silently', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')))
        await expect(createDoubleGame('Test')).resolves.toBeUndefined()
    })
})

describe('joinGame', () => {
    it('returns { success: true } on 200', async () => {
        vi.stubGlobal('fetch', mockFetch({}, true, 200))
        const result = await joinGame('game-123')
        expect(result).toEqual({ success: true })
    })

    it('returns { success: false, message } on non-200', async () => {
        vi.stubGlobal('fetch', mockFetch({ message: 'Room full' }, false, 400))
        const result = await joinGame('game-123')
        expect(result.success).toBe(false)
        expect(result.message).toBe('Room full')
    })

    it('returns fallback message when server provides none', async () => {
        vi.stubGlobal('fetch', mockFetch({}, false, 400))
        const result = await joinGame('game-123')
        expect(result.success).toBe(false)
        expect(result.message).toBe('Failed to join game')
    })

    it('returns { success: false } on network error', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('net')))
        const result = await joinGame('game-123')
        expect(result.success).toBe(false)
    })

    it('calls the correct URL with gameID in body and credentials', async () => {
        const fetchMock = mockFetch({}, true)
        vi.stubGlobal('fetch', fetchMock)
        await joinGame('abc')
        expect(fetchMock).toHaveBeenCalledWith(`${BASE}/game/join`, expect.objectContaining({
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ gameID: 'abc' }),
        }))
    })
})

describe('getAvailableGames', () => {
    it('returns availableGames on success', async () => {
        const games = [{ name: 'Room1', id: 'id1' }]
        vi.stubGlobal('fetch', mockFetch({ availableGames: games }))
        const result = await getAvailableGames()
        expect(result).toEqual(games)
    })

    it('appends searchGameID as query param when provided', async () => {
        const fetchMock = mockFetch({ availableGames: [] })
        vi.stubGlobal('fetch', fetchMock)
        await getAvailableGames('abc123')
        const calledUrl = fetchMock.mock.calls[0][0] as string
        expect(calledUrl).toContain('gameID=abc123')
    })

    it('returns [] on error', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')))
        const result = await getAvailableGames()
        expect(result).toEqual([])
    })
})
