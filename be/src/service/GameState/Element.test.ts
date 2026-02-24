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
        it('detects collision when rectangles overlap', () => {
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

        it('returns false when edges exactly touch (no overlap)', () => {
            const el1 = new Element({ x: 100, y: 100 }, { width: 40, height: 40 })
            const el2 = new Element({ x: 140, y: 100 }, { width: 40, height: 40 })
            expect(el1.detectCollisionWithElement(el2)).toBe(false)
        })

        it('returns false when just beyond overlap distance', () => {
            const el1 = new Element({ x: 100, y: 100 }, { width: 40, height: 40 })
            const el2 = new Element({ x: 141, y: 100 }, { width: 40, height: 40 })
            expect(el1.detectCollisionWithElement(el2)).toBe(false)
        })

        it('detects collision between different-sized elements', () => {
            // Meteor 100x100 at (200,200), Projectile 50x20 at (260,200)
            // x: 200+50=250 > 260-25=235 and 260+25=285 > 200-50=150 => overlap
            // y: 200+50=250 > 200-10=190 and 200+10=210 > 200-50=150 => overlap
            const meteor = new Element({ x: 200, y: 200 }, { width: 100, height: 100 })
            const projectile = new Element({ x: 260, y: 200 }, { width: 50, height: 20 })
            expect(meteor.detectCollisionWithElement(projectile)).toBe(true)
        })

        it('returns false for different-sized elements that do not overlap', () => {
            const meteor = new Element({ x: 200, y: 200 }, { width: 100, height: 100 })
            const projectile = new Element({ x: 400, y: 200 }, { width: 50, height: 20 })
            expect(meteor.detectCollisionWithElement(projectile)).toBe(false)
        })

        it('is symmetric: a.collides(b) equals b.collides(a)', () => {
            const el1 = new Element({ x: 100, y: 100 }, { width: 60, height: 40 })
            const el2 = new Element({ x: 130, y: 110 }, { width: 40, height: 60 })
            expect(el1.detectCollisionWithElement(el2)).toBe(true)
            expect(el2.detectCollisionWithElement(el1)).toBe(true)
        })
    })
})
