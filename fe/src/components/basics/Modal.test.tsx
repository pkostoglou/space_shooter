import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from './Modal'

describe('Modal', () => {
    it('renders nothing when isOpen is false', () => {
        render(<Modal isOpen={false}><p>Hidden</p></Modal>)
        expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
    })

    it('renders children when isOpen is true', () => {
        render(<Modal isOpen={true}><p>Visible</p></Modal>)
        expect(screen.getByText('Visible')).toBeInTheDocument()
    })

    it('calls setIsOpen(false) when clicking outside the modal content', () => {
        const setIsOpen = vi.fn()
        render(
            <Modal isOpen={true} setIsOpen={setIsOpen}>
                <div data-testid="content">Inside</div>
            </Modal>
        )
        // Fire mousedown on the backdrop (document body, outside modal content div)
        fireEvent.mouseDown(document.body)
        expect(setIsOpen).toHaveBeenCalledWith(false)
    })

    it('does not call setIsOpen when clicking inside the modal content', () => {
        const setIsOpen = vi.fn()
        render(
            <Modal isOpen={true} setIsOpen={setIsOpen}>
                <div data-testid="content">Inside</div>
            </Modal>
        )
        fireEvent.mouseDown(screen.getByTestId('content'))
        expect(setIsOpen).not.toHaveBeenCalled()
    })

    it('does not throw when setIsOpen is not provided and clicking outside', () => {
        render(
            <Modal isOpen={true}>
                <div data-testid="content">No close handler</div>
            </Modal>
        )
        expect(() => fireEvent.mouseDown(document.body)).not.toThrow()
    })
})
