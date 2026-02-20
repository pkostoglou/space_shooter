import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Toast from './Toast'
import { ToastItem } from '../../context/ToastContext'

function makeToast(overrides?: Partial<ToastItem>): ToastItem {
    return { id: '1', message: 'Test message', type: 'info', ...overrides }
}

describe('Toast', () => {
    it('renders the message text', () => {
        render(<Toast toast={makeToast({ message: 'Hello!' })} onClose={vi.fn()} />)
        expect(screen.getByText('Hello!')).toBeInTheDocument()
    })

    it('renders a Dismiss button', () => {
        render(<Toast toast={makeToast()} onClose={vi.fn()} />)
        expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
    })

    it('calls onClose when the Dismiss button is clicked', async () => {
        const onClose = vi.fn()
        const user = userEvent.setup()
        render(<Toast toast={makeToast()} onClose={onClose} />)
        await user.click(screen.getByRole('button', { name: 'Dismiss' }))
        expect(onClose).toHaveBeenCalledOnce()
    })

    it('applies info styles for type=info', () => {
        render(<Toast toast={makeToast({ type: 'info' })} onClose={vi.fn()} />)
        const alert = screen.getByRole('alert')
        expect(alert.className).toContain('bg-blue-500')
    })

    it('applies warning styles for type=warning', () => {
        render(<Toast toast={makeToast({ type: 'warning' })} onClose={vi.fn()} />)
        const alert = screen.getByRole('alert')
        expect(alert.className).toContain('bg-yellow-400')
    })

    it('applies error styles for type=error', () => {
        render(<Toast toast={makeToast({ type: 'error' })} onClose={vi.fn()} />)
        const alert = screen.getByRole('alert')
        expect(alert.className).toContain('bg-red-500')
    })

    it('has role="alert"', () => {
        render(<Toast toast={makeToast()} onClose={vi.fn()} />)
        expect(screen.getByRole('alert')).toBeInTheDocument()
    })
})
