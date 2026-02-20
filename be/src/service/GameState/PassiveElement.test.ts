import { describe, it, expect } from 'vitest'
import PassiveElement from './PassiveElement.js'

describe('PassiveElement', () => {
    describe('passiveMovement()', () => {
        it('moves horizontally along a flat line (a=0)', () => {
            // From (0, 100) to (100, 100): a=0, b=100, angle=0, direction=1
            const el = new PassiveElement({ x: 0, y: 100 }, { x: 100, y: 100 }, { width: 10, height: 10 })
            const before = el.getPosition()
            expect(before.x).toBe(0)
            expect(before.y).toBe(100)

            el.passiveMovement(16)
            const after = el.getPosition()
            // x += 4 * (16/16) * cos(0) * 1 = 4
            expect(after.x).toBeCloseTo(4, 5)
            // y = 0 * x + 100 = 100
            expect(after.y).toBeCloseTo(100, 5)
        })

        it('moves along a 45-degree diagonal', () => {
            // From (0,0) to (100,100): a=1, angle=pi/4, direction=1
            const el = new PassiveElement({ x: 0, y: 0 }, { x: 100, y: 100 }, { width: 10, height: 10 })
            el.passiveMovement(16)
            const pos = el.getPosition()
            // x += 4 * cos(pi/4) = 4 * sqrt(2)/2 ≈ 2.828
            expect(pos.x).toBeCloseTo(4 * Math.cos(Math.PI / 4), 5)
            // y = 1 * x + 0
            expect(pos.y).toBeCloseTo(pos.x, 5)
        })

        it('moves in reverse direction when target is to the left', () => {
            // From (100, 50) to (0, 50): direction = -1, a=0
            const el = new PassiveElement({ x: 100, y: 50 }, { x: 0, y: 50 }, { width: 10, height: 10 })
            el.passiveMovement(16)
            const pos = el.getPosition()
            // x += 4 * cos(0) * -1 = -4 → x = 96
            expect(pos.x).toBeCloseTo(96, 5)
            expect(pos.y).toBeCloseTo(50, 5)
        })

        it('accumulates movement over multiple ticks', () => {
            const el = new PassiveElement({ x: 0, y: 100 }, { x: 100, y: 100 }, { width: 10, height: 10 })
            el.passiveMovement(16)
            el.passiveMovement(16)
            el.passiveMovement(16)
            const pos = el.getPosition()
            // After 3 ticks: x = 12
            expect(pos.x).toBeCloseTo(12, 5)
        })

        it('scales movement with deltaTime', () => {
            const el = new PassiveElement({ x: 0, y: 0 }, { x: 100, y: 0 }, { width: 10, height: 10 })
            el.passiveMovement(32) // double deltaTime
            const pos = el.getPosition()
            // x += 4 * (32/16) * 1 = 8
            expect(pos.x).toBeCloseTo(8, 5)
        })
    })
})
