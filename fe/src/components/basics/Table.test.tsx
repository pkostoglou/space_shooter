import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Table from './Table'

describe('Table', () => {
    it('renders column headers', () => {
        render(<Table headers={['Name', 'Score', 'Date']} data={[]} />)
        expect(screen.getByText('Name')).toBeInTheDocument()
        expect(screen.getByText('Score')).toBeInTheDocument()
        expect(screen.getByText('Date')).toBeInTheDocument()
    })

    it('renders data rows', () => {
        const data = [
            [<span key="a">Alice</span>, <span key="b">100</span>],
            [<span key="c">Bob</span>, <span key="d">200</span>],
        ]
        render(<Table headers={['Name', 'Score']} data={data} />)
        expect(screen.getByText('Alice')).toBeInTheDocument()
        expect(screen.getByText('Bob')).toBeInTheDocument()
        expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('renders empty table body when data is empty', () => {
        render(<Table headers={['Name']} data={[]} />)
        const rows = screen.getAllByRole('row')
        // Only the header row
        expect(rows).toHaveLength(1)
    })

    it('does not render tableActions toolbar when tableActions is undefined', () => {
        render(<Table headers={['A']} data={[]} />)
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('renders refresh button when refresh action is provided', () => {
        render(
            <Table
                headers={['A']}
                data={[]}
                tableActions={{ refresh: { onRefresh: vi.fn() } }}
            />
        )
        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('calls onRefresh when refresh button is clicked', async () => {
        const onRefresh = vi.fn()
        const user = userEvent.setup()
        render(
            <Table
                headers={['A']}
                data={[]}
                tableActions={{ refresh: { onRefresh } }}
            />
        )
        await user.click(screen.getByRole('button'))
        expect(onRefresh).toHaveBeenCalledOnce()
    })

    it('renders search input when searchDocument action is provided', () => {
        render(
            <Table
                headers={['A']}
                data={[]}
                tableActions={{ searchDocument: { onType: vi.fn(), placeholder: 'Search here' } }}
            />
        )
        expect(screen.getByPlaceholderText('Search here')).toBeInTheDocument()
    })

    it('calls onType when user types in the search input', async () => {
        const onType = vi.fn()
        const user = userEvent.setup()
        render(
            <Table
                headers={['A']}
                data={[]}
                tableActions={{ searchDocument: { onType, placeholder: 'Search' } }}
            />
        )
        await user.type(screen.getByPlaceholderText('Search'), 'abc')
        expect(onType).toHaveBeenCalled()
    })
})
