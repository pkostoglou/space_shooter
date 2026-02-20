import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import GameRegistry from './GameRegistry.js'
import { randomUUID } from 'node:crypto'
import type { UUID } from 'node:crypto'

describe('GameRegistry', () => {
    let registry: GameRegistry

    beforeEach(() => {
        vi.useFakeTimers()
        registry = new GameRegistry()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    describe('createNewSingleGame()', () => {
        it('creates a slot with mode=single and the player registered', () => {
            const playerID = randomUUID()
            const gameID = registry.createNewSingleGame(playerID)
            const slot = registry.getSlot(gameID)
            expect(slot).toBeDefined()
            expect(slot?.mode).toBe('single')
            expect(slot?.players).toContain(playerID)
            registry.clearSlot(gameID)
        })

        it('returns a UUID for the new game', () => {
            const playerID = randomUUID()
            const gameID = registry.createNewSingleGame(playerID)
            expect(typeof gameID).toBe('string')
            expect(gameID).toMatch(/^[0-9a-f-]{36}$/)
            registry.clearSlot(gameID)
        })
    })

    describe('createNewDoubleGame()', () => {
        it('creates a slot with mode=double and the given game name', () => {
            const playerID = randomUUID()
            const gameID = registry.createNewDoubleGame(playerID, 'My Game')
            const slot = registry.getSlot(gameID)
            expect(slot?.mode).toBe('double')
            expect(slot?.gameName).toBe('My Game')
            registry.clearSlot(gameID)
        })

        it('game starts inactive (waiting for second player)', () => {
            const playerID = randomUUID()
            const gameID = registry.createNewDoubleGame(playerID, 'Waiting')
            const slot = registry.getSlot(gameID)
            const info = JSON.parse(slot!.gameState.getGameInfo())
            expect(info.isGameActive).toBe(false)
            registry.clearSlot(gameID)
        })
    })

    describe('joinGame()', () => {
        it('adds a second player and returns true', () => {
            const p1 = randomUUID()
            const p2 = randomUUID()
            const gameID = registry.createNewDoubleGame(p1, 'Join Test')
            const result = registry.joinGame(p2, gameID)
            expect(result).toBe(true)
            expect(registry.getSlot(gameID)?.players).toHaveLength(2)
            registry.clearSlot(gameID)
        })

        it('returns false for a non-existent game', () => {
            const result = registry.joinGame(randomUUID(), randomUUID() as UUID)
            expect(result).toBe(false)
        })

        it('returns false when the game already has 2 players', () => {
            const p1 = randomUUID()
            const p2 = randomUUID()
            const p3 = randomUUID()
            const gameID = registry.createNewDoubleGame(p1, 'Full')
            registry.joinGame(p2, gameID)
            const result = registry.joinGame(p3, gameID)
            expect(result).toBe(false)
            registry.clearSlot(gameID)
        })
    })

    describe('getAvailableGames()', () => {
        it('returns only double-mode games with fewer than 2 players', () => {
            const singlePlayer = randomUUID()
            const doublePlayer = randomUUID()
            const fullPlayer1 = randomUUID()
            const fullPlayer2 = randomUUID()

            registry.createNewSingleGame(singlePlayer) // should not appear

            const availableID = registry.createNewDoubleGame(doublePlayer, 'Open')
            const fullID = registry.createNewDoubleGame(fullPlayer1, 'Full')
            registry.joinGame(fullPlayer2, fullID)

            const available = registry.getAvailableGames(undefined)

            expect(available.some(g => g.id === availableID)).toBe(true)
            expect(available.some(g => g.id === fullID)).toBe(false)

            registry.clearSlot(availableID)
            registry.clearSlot(fullID)
        })

        it('filters by search string when provided', () => {
            const p1 = randomUUID()
            const p2 = randomUUID()
            const id1 = registry.createNewDoubleGame(p1, 'Alpha Game')
            const id2 = registry.createNewDoubleGame(p2, 'Beta Game')

            const results = registry.getAvailableGames('Alpha')
            expect(results.some(g => g.id === id1)).toBe(true)
            expect(results.some(g => g.id === id2)).toBe(false)

            registry.clearSlot(id1)
            registry.clearSlot(id2)
        })
    })

    describe('startLoop()', () => {
        it('sets updateInterval on the slot', () => {
            const playerID = randomUUID()
            const gameID = registry.createNewSingleGame(playerID)
            expect(registry.getSlot(gameID)?.updateInterval).toBeNull()
            registry.startLoop(gameID)
            expect(registry.getSlot(gameID)?.updateInterval).not.toBeNull()
            registry.clearSlot(gameID)
        })

        it('does not start a second interval if already running', () => {
            const playerID = randomUUID()
            const gameID = registry.createNewSingleGame(playerID)
            registry.startLoop(gameID)
            const interval1 = registry.getSlot(gameID)?.updateInterval
            registry.startLoop(gameID) // second call should be a no-op
            const interval2 = registry.getSlot(gameID)?.updateInterval
            expect(interval1).toBe(interval2)
            registry.clearSlot(gameID)
        })
    })

    describe('clearSlot()', () => {
        it('removes the slot from the registry', () => {
            const playerID = randomUUID()
            const gameID = registry.createNewSingleGame(playerID)
            registry.clearSlot(gameID)
            expect(registry.getSlot(gameID)).toBeUndefined()
        })

        it('stops an active interval when clearing', () => {
            const playerID = randomUUID()
            const gameID = registry.createNewSingleGame(playerID)
            registry.startLoop(gameID)
            expect(registry.getSlot(gameID)?.updateInterval).not.toBeNull()
            registry.clearSlot(gameID)
            expect(registry.getSlot(gameID)).toBeUndefined()
        })

        it('is safe to call on a non-existent slot', () => {
            expect(() => registry.clearSlot(randomUUID() as UUID)).not.toThrow()
        })
    })
})
