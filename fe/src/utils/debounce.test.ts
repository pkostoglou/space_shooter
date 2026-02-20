import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce } from './debounce'

describe('debounce', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => {
        vi.clearAllTimers()
        vi.useRealTimers()
    })

    it('does not call the function before the delay elapses', () => {
        const fn = vi.fn()
        debounce(fn, 500)
        vi.advanceTimersByTime(499)
        expect(fn).not.toHaveBeenCalled()
    })

    it('calls the function after the delay elapses', () => {
        const fn = vi.fn()
        debounce(fn, 500)
        vi.advanceTimersByTime(500)
        expect(fn).toHaveBeenCalledOnce()
    })

    it('only fires the last call when invoked multiple times in rapid succession', () => {
        const fn1 = vi.fn()
        const fn2 = vi.fn()
        debounce(fn1, 500)
        debounce(fn2, 500)
        vi.advanceTimersByTime(500)
        expect(fn1).not.toHaveBeenCalled()
        expect(fn2).toHaveBeenCalledOnce()
    })

    it('fires again after the delay when called a second time after the first fires', () => {
        const fn = vi.fn()
        debounce(fn, 300)
        vi.advanceTimersByTime(300)
        expect(fn).toHaveBeenCalledOnce()

        debounce(fn, 300)
        vi.advanceTimersByTime(300)
        expect(fn).toHaveBeenCalledTimes(2)
    })
})
