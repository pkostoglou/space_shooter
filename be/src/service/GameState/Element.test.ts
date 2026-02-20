import { describe, it, expect } from 'vitest'
import Element from './Element.js'

describe('Element', () => {
    describe('isOutOfBound()', () => {
        it('returns false for an element well within bounds', () => {
            const el = new Element({ x: 700, y: 450 }, { width: 40, height: 40 })
            expect(el.isOutOfBound()).toBe(false)
        })

        it('returns true when x >= 2500', () => {
            const el = new Element({ x: 2500, y: 100 }, { width: 40, height: 40 })
            expect(el.isOutOfBound()).toBe(true)
        })

        it('returns true when x <= -10', () => {
            const el = new Element({ x: -10, y: 100 }, { width: 40, height: 40 })
            expect(el.isOutOfBound()).toBe(true)
        })

        it('returns true when y > 2500', () => {
            const el = new Element({ x: 100, y: 2501 }, { width: 40, height: 40 })
            expect(el.isOutOfBound()).toBe(true)
        })

        it('returns true when y <= -10', () => {
            const el = new Element({ x: 100, y: -10 }, { width: 40, height: 40 })
            expect(el.isOutOfBound()).toBe(true)
        })

        it('returns false at boundary x = 0', () => {
            const el = new Element({ x: 0, y: 100 }, { width: 40, height: 40 })
            expect(el.isOutOfBound()).toBe(false)
        })
    })

    describe('detectCollisionWithElement()', () => {
        it('detects a collision when elements are within 40px in both axes', () => {
            const el1 = new Element({ x: 100, y: 100 }, { width: 40, height: 40 })
            const el2 = new Element({ x: 120, y: 120 }, { width: 40, height: 40 })
            expect(el1.detectCollisionWithElement(el2)).toBe(true)
        })

        it('returns false when elements are far apart on x axis', () => {
            const el1 = new Element({ x: 0, y: 100 }, { width: 40, height: 40 })
            const el2 = new Element({ x: 500, y: 100 }, { width: 40, height: 40 })
            expect(el1.detectCollisionWithElement(el2)).toBe(false)
        })

        it('returns false when elements are far apart on y axis', () => {
            const el1 = new Element({ x: 100, y: 0 }, { width: 40, height: 40 })
            const el2 = new Element({ x: 100, y: 500 }, { width: 40, height: 40 })
            expect(el1.detectCollisionWithElement(el2)).toBe(false)
        })

        it('detects collision at exact 40px distance on both axes', () => {
            const el1 = new Element({ x: 100, y: 100 }, { width: 40, height: 40 })
            const el2 = new Element({ x: 140, y: 140 }, { width: 40, height: 40 })
            expect(el1.detectCollisionWithElement(el2)).toBe(true)
        })

        it('returns false at 41px distance on x axis', () => {
            const el1 = new Element({ x: 100, y: 100 }, { width: 40, height: 40 })
            const el2 = new Element({ x: 141, y: 100 }, { width: 40, height: 40 })
            expect(el1.detectCollisionWithElement(el2)).toBe(false)
        })
    })
})
