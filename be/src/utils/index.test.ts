import { describe, it, expect } from 'vitest'
import { extractCookies } from './index.js'

describe('extractCookies', () => {
    it('parses a single cookie', () => {
        expect(extractCookies('foo=bar')).toEqual({ foo: 'bar' })
    })

    it('parses multiple cookies', () => {
        expect(extractCookies('foo=bar; baz=qux')).toEqual({ foo: 'bar', baz: 'qux' })
    })

    it('returns empty object for empty string', () => {
        expect(extractCookies('')).toEqual({})
    })

    it('ignores malformed pairs without an equals sign', () => {
        const result = extractCookies('foo=bar; malformed; baz=qux')
        expect(result['foo']).toBe('bar')
        expect(result['baz']).toBe('qux')
        expect(result['malformed']).toBeUndefined()
    })

    it('parses userID and gameID cookies', () => {
        const result = extractCookies('userID=abc-123; gameID=def-456')
        expect(result['userID']).toBe('abc-123')
        expect(result['gameID']).toBe('def-456')
    })
})
