import { describe, it, expect } from 'vitest'
import Player from './Player.js'

describe('Player', () => {
    describe('move()', () => {
        it('moves right with horizontal = 1', () => {
            const p = new Player({ x: 450, y: 450 })
            p.move({ horizontal: 1, vertical: 0 }, 16)
            expect(p.getInfo().position.x).toBeGreaterThan(450)
            expect(p.getInfo().position.y).toBe(450)
        })

        it('moves left with horizontal = -1', () => {
            const p = new Player({ x: 450, y: 450 })
            p.move({ horizontal: -1, vertical: 0 }, 16)
            expect(p.getInfo().position.x).toBeLessThan(450)
        })

        it('moves down with vertical = 1', () => {
            const p = new Player({ x: 450, y: 450 })
            p.move({ horizontal: 0, vertical: 1 }, 16)
            expect(p.getInfo().position.y).toBeGreaterThan(450)
            expect(p.getInfo().position.x).toBe(450)
        })

        it('moves up with vertical = -1', () => {
            const p = new Player({ x: 450, y: 450 })
            p.move({ horizontal: 0, vertical: -1 }, 16)
            expect(p.getInfo().position.y).toBeLessThan(450)
        })

        it('stays put when both components are 0', () => {
            const p = new Player({ x: 450, y: 450 })
            p.move({ horizontal: 0, vertical: 0 }, 16)
            expect(p.getInfo().position.x).toBe(450)
            expect(p.getInfo().position.y).toBe(450)
        })

        it('scales movement proportionally to deltaTime', () => {
            const p1 = new Player({ x: 0, y: 0 })
            const p2 = new Player({ x: 0, y: 0 })
            p1.move({ horizontal: 1, vertical: 0 }, 16)
            p2.move({ horizontal: 1, vertical: 0 }, 32)
            // p2 should move twice as far
            expect(p2.getInfo().position.x).toBeCloseTo(p1.getInfo().position.x * 2, 5)
        })
    })

    describe('fire rate', () => {
        it('cannot shoot initially', () => {
            const p = new Player({ x: 450, y: 450 })
            expect(p.canShoot()).toBe(false)
        })

        it('can shoot after shootCountdown depletes the fire rate', () => {
            const p = new Player({ x: 450, y: 450 })
            // fire rate starts at 0.5 seconds; decrement by 600ms total
            p.shootCountdown(300)
            p.shootCountdown(300)
            expect(p.canShoot()).toBe(true)
        })

        it('resets fire rate after resetShootCountdown', () => {
            const p = new Player({ x: 450, y: 450 })
            p.shootCountdown(600)
            expect(p.canShoot()).toBe(true)
            p.resetShootCountdown()
            expect(p.canShoot()).toBe(false)
        })

        it('partially consumed fire rate is not ready to shoot', () => {
            const p = new Player({ x: 450, y: 450 })
            p.shootCountdown(100) // only 100ms out of 500ms
            expect(p.canShoot()).toBe(false)
        })
    })
})
