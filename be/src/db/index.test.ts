import { describe, it, expect } from 'vitest'
import { createDatabase } from './index.js'

describe('createDatabase', () => {
    it('returns a Database object with a game repository', () => {
        const db = createDatabase()
        expect(db.game).toBeDefined()
        expect(typeof db.game.saveScore).toBe('function')
        expect(typeof db.game.getLeaderboard).toBe('function')
    })
})
