import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import WebSocket from 'ws'
import { randomUUID } from 'node:crypto'
import initializeGameStatesManager from './socket.js'
import GameRegistry from './GameRegistry.js'

describe('WebSocket handler (socket.ts)', () => {
    let server: ReturnType<typeof createServer>
    let wss: WebSocketServer
    let registry: GameRegistry
    let port: number

    beforeEach(async () => {
        server = createServer()
        wss = new WebSocketServer({ server })
        registry = new GameRegistry()
        initializeGameStatesManager(wss, registry)
        await new Promise<void>(resolve => server.listen(0, resolve))
        const addr = server.address() as { port: number }
        port = addr.port
    })

    afterEach(async () => {
        wss.close()
        await new Promise<void>(resolve => server.close(() => resolve()))
    })

    it('accepts a connection with unknown gameID without crashing', async () => {
        const ws = new WebSocket(`ws://localhost:${port}`, {
            headers: { cookie: `userID=${randomUUID()}; gameID=${randomUUID()}` }
        })
        await new Promise<void>((resolve, reject) => {
            ws.on('open', () => { ws.close(); resolve() })
            ws.on('error', reject)
        })
    })

    it('sends game state messages after connecting with a valid game slot', async () => {
        const playerID = randomUUID()
        const gameID = registry.createNewSingleGame(playerID)

        const ws = new WebSocket(`ws://localhost:${port}`, {
            headers: { cookie: `userID=${playerID}; gameID=${gameID}` }
        })

        const message = await new Promise<string>((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('timeout: no message received')), 500)
            ws.on('message', data => {
                clearTimeout(timer)
                ws.close()
                resolve(data.toString())
            })
            ws.on('error', err => { clearTimeout(timer); reject(err) })
        })

        const state = JSON.parse(message)
        expect(state).toHaveProperty('isGameActive', true)
        expect(state).toHaveProperty('score', 0)
        expect(state).toHaveProperty('player')
        expect(state).toHaveProperty('meteors')
        expect(state).toHaveProperty('projectiles')
    })

    it('clears the game slot when the connection closes', async () => {
        const playerID = randomUUID()
        const gameID = registry.createNewSingleGame(playerID)

        const ws = new WebSocket(`ws://localhost:${port}`, {
            headers: { cookie: `userID=${playerID}; gameID=${gameID}` }
        })

        await new Promise<void>((resolve, reject) => {
            ws.on('open', () => {
                ws.close()
                resolve()
            })
            ws.on('error', reject)
        })

        // Give the server a moment to process the close event
        await new Promise<void>(resolve => setTimeout(resolve, 50))

        expect(registry.getSlot(gameID)).toBeUndefined()
    })

    it('handles restart message without throwing', async () => {
        const playerID = randomUUID()
        const gameID = registry.createNewSingleGame(playerID)

        const ws = new WebSocket(`ws://localhost:${port}`, {
            headers: { cookie: `userID=${playerID}; gameID=${gameID}` }
        })

        await new Promise<void>((resolve, reject) => {
            ws.on('open', () => {
                ws.send(JSON.stringify({ type: 'restart' }))
                setTimeout(() => { ws.close(); resolve() }, 100)
            })
            ws.on('error', reject)
        })
    })
})
