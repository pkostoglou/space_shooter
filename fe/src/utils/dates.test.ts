import { describe, it, expect } from 'vitest'
import { formatDate } from './dates'

describe('formatDate', () => {
    it('returns a string', () => {
        const result = formatDate(new Date('2024-01-15T10:30:00'))
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
    })

    it('includes the year', () => {
        const result = formatDate(new Date('2024-06-15T10:30:00'))
        expect(result).toContain('2024')
    })

    it('includes the abbreviated month', () => {
        const result = formatDate(new Date('2024-01-15T10:30:00'))
        expect(result).toContain('Jan')
    })

    it('includes the day', () => {
        const result = formatDate(new Date('2024-01-05T10:30:00'))
        expect(result).toContain('5')
    })

    it('accepts a Date object', () => {
        const date = new Date(2024, 5, 1, 12, 0, 0)
        const result = formatDate(date)
        expect(result).toContain('2024')
    })
})
