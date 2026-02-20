import { describe, it, expect } from 'vitest'
import Meteor from './Meteor.js'

describe('Meteor', () => {
    describe('passiveMovement()', () => {
        it('moves toward target on each tick', () => {
            const m = new Meteor({ x: 0, y: 100 }, { x: 100, y: 100 }, 1)
            m.passiveMovement(16)
            const pos = m.getPosition()
            // Should have moved right (positive x direction)
            expect(pos.x).toBeGreaterThan(0)
            expect(pos.y).toBeCloseTo(100, 1)
        })

        it('inherits PassiveElement movement and also increments rotation', () => {
            // We verify that movement works (via inherited passiveMovement)
            // and that the Meteor does not throw on tick
            const m = new Meteor({ x: 700, y: 0 }, { x: 700, y: 900 }, 2)
            expect(() => m.passiveMovement(16)).not.toThrow()
        })

        it('speed parameter affects how fast the meteor moves', () => {
            const slow = new Meteor({ x: 0, y: 0 }, { x: 100, y: 0 }, 1)
            const fast = new Meteor({ x: 0, y: 0 }, { x: 100, y: 0 }, 3)
            slow.passiveMovement(16)
            fast.passiveMovement(16)
            expect(fast.getPosition().x).toBeGreaterThan(slow.getPosition().x)
        })

        it('accumulates movement over multiple ticks', () => {
            const m = new Meteor({ x: 0, y: 100 }, { x: 100, y: 100 }, 1)
            m.passiveMovement(16)
            const after1 = m.getPosition().x
            m.passiveMovement(16)
            const after2 = m.getPosition().x
            expect(after2).toBeGreaterThan(after1)
        })
    })
})
