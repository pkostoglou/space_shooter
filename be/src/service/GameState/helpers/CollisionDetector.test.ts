import { describe, it, expect } from 'vitest'
import { detectCollisions } from './CollisionDetector.js'
import Meteor from '../Meteor.js'
import Projectile from '../Projectile.js'
import Player from '../Player.js'
import type { UUID } from 'node:crypto'
import { randomUUID } from 'node:crypto'

describe('detectCollisions', () => {
    it('returns empty arrays and zero score when nothing collides', () => {
        const meteor = new Meteor({ x: 0, y: 0 }, { x: 100, y: 0 }, 1)
        const projectile = new Projectile(1, { x: 1000, y: 1000 }, { x: 1100, y: 1000 })
        const playerID = randomUUID()
        const players: Record<UUID, { player: Player; targetPosition: null }> = {
            [playerID]: { player: new Player({ x: 500, y: 500 }), targetPosition: null }
        }

        const result = detectCollisions([meteor], [projectile], players)

        expect(result.meteors).toHaveLength(1)
        expect(result.projectiles).toHaveLength(1)
        expect(result.scoreIncrement).toBe(0)
        expect(result.gameOver).toBe(false)
    })

    it('removes meteor and projectile and adds 100 to score on impact', () => {
        // Place meteor and projectile at the same position so they collide
        const pos = { x: 200, y: 200 }
        const meteor = new Meteor(pos, { x: 300, y: 200 }, 1)
        const projectile = new Projectile(1, pos, { x: 300, y: 200 })
        const playerID = randomUUID()
        const players: Record<UUID, { player: Player; targetPosition: null }> = {
            [playerID]: { player: new Player({ x: 700, y: 700 }), targetPosition: null }
        }

        const result = detectCollisions([meteor], [projectile], players)

        expect(result.meteors).toHaveLength(0)
        expect(result.projectiles).toHaveLength(0)
        expect(result.scoreIncrement).toBe(100)
        expect(result.gameOver).toBe(false)
    })

    it('accumulates +100 per meteor destroyed', () => {
        const pos1 = { x: 100, y: 100 }
        const pos2 = { x: 300, y: 300 }
        const meteor1 = new Meteor(pos1, { x: 200, y: 100 }, 1)
        const meteor2 = new Meteor(pos2, { x: 400, y: 300 }, 1)
        const proj1 = new Projectile(1, pos1, { x: 200, y: 100 })
        const proj2 = new Projectile(1, pos2, { x: 400, y: 300 })
        const playerID = randomUUID()
        const players: Record<UUID, { player: Player; targetPosition: null }> = {
            [playerID]: { player: new Player({ x: 700, y: 700 }), targetPosition: null }
        }

        const result = detectCollisions([meteor1, meteor2], [proj1, proj2], players)

        expect(result.scoreIncrement).toBe(200)
        expect(result.meteors).toHaveLength(0)
    })

    it('sets gameOver when a meteor collides with a player', () => {
        const playerPos = { x: 500, y: 500 }
        const meteor = new Meteor(playerPos, { x: 600, y: 500 }, 1)
        const playerID = randomUUID()
        const players: Record<UUID, { player: Player; targetPosition: null }> = {
            [playerID]: { player: new Player(playerPos), targetPosition: null }
        }

        const result = detectCollisions([meteor], [], players)

        expect(result.gameOver).toBe(true)
        expect(result.scoreIncrement).toBe(0)
    })

    it('handles empty arrays gracefully', () => {
        const result = detectCollisions([], [], {})
        expect(result.meteors).toHaveLength(0)
        expect(result.projectiles).toHaveLength(0)
        expect(result.scoreIncrement).toBe(0)
        expect(result.gameOver).toBe(false)
    })
})
