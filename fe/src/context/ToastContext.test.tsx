import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReactNode } from 'react'
import { ToastProvider, useToast, ToastType } from './ToastContext'

function renderWithProvider(ui: ReactNode) {
    return render(<ToastProvider>{ui}</ToastProvider>)
}

const PushButton = ({ message, type }: { message: string; type: ToastType }) => {
    const { pushToast } = useToast()
    return <button onClick={() => pushToast(message, type)}>push</button>
}

describe('useToast', () => {
    it('throws when used outside ToastProvider', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        expect(() => renderHook(() => useToast())).toThrow('useToast must be used inside ToastProvider')
        consoleSpy.mockRestore()
    })
})

describe('ToastProvider — pushToast', () => {
    it('adds a toast with the given message', async () => {
        const user = userEvent.setup()
        renderWithProvider(<PushButton message="Hello World" type="info" />)
        await user.click(screen.getByRole('button'))
        expect(screen.getByText('Hello World')).toBeInTheDocument()
    })

    it('adds multiple toasts independently', async () => {
        const user = userEvent.setup()
        renderWithProvider(
            <>
                <PushButton message="First" type="info" />
                <PushButton message="Second" type="error" />
            </>
        )
        const [btn1, btn2] = screen.getAllByRole('button')
        await user.click(btn1)
        await user.click(btn2)
        expect(screen.getByText('First')).toBeInTheDocument()
        expect(screen.getByText('Second')).toBeInTheDocument()
    })

    it('evicts the oldest toast when max (5) is exceeded', async () => {
        const wrapper = ({ children }: { children: ReactNode }) => (
            <ToastProvider>{children}</ToastProvider>
        )
        const { result } = renderHook(() => useToast(), { wrapper })

        for (let i = 1; i <= 5; i++) {
            act(() => { result.current.pushToast(`msg${i}`, 'info') })
        }
        expect(screen.getByText('msg1')).toBeInTheDocument()

        act(() => { result.current.pushToast('msg6', 'info') })
        expect(screen.queryByText('msg1')).not.toBeInTheDocument()
        expect(screen.getByText('msg6')).toBeInTheDocument()
    })
})

describe('ToastProvider — auto-dismiss', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('removes toast after 4 seconds', () => {
        const wrapper = ({ children }: { children: ReactNode }) => (
            <ToastProvider>{children}</ToastProvider>
        )
        const { result } = renderHook(() => useToast(), { wrapper })

        act(() => { result.current.pushToast('Bye soon', 'warning') })
        expect(screen.getByText('Bye soon')).toBeInTheDocument()

        act(() => { vi.advanceTimersByTime(4100) })
        expect(screen.queryByText('Bye soon')).not.toBeInTheDocument()
    })

    it('does not remove toast before 4 seconds', () => {
        const wrapper = ({ children }: { children: ReactNode }) => (
            <ToastProvider>{children}</ToastProvider>
        )
        const { result } = renderHook(() => useToast(), { wrapper })

        act(() => { result.current.pushToast('Still here', 'info') })
        act(() => { vi.advanceTimersByTime(3900) })
        expect(screen.getByText('Still here')).toBeInTheDocument()
    })
})

describe('ToastProvider — manual close', () => {
    it('removes toast when Dismiss button is clicked', async () => {
        const user = userEvent.setup()
        renderWithProvider(<PushButton message="Dismiss me" type="info" />)
        await user.click(screen.getByRole('button', { name: 'push' }))
        expect(screen.getByText('Dismiss me')).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Dismiss' }))
        expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument()
    })
})
