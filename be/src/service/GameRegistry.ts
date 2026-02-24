import { randomUUID } from "node:crypto"
import type { UUID } from "node:crypto"
import type { WebSocket } from "ws"
import GameState from "./GameState/GameState.js"
import type { TGameManager } from "../domains/gameTypes.js"

type GameSlot = {
    gameState: GameState
    mode: 'single' | 'double'
    connections: Map<UUID, WebSocket>
    players: UUID[]
    updateInterval: NodeJS.Timeout | null
    gameName: string
    restartRequests: Set<UUID>
}

class GameRegistry implements TGameManager {
    private slots: { [key: UUID]: GameSlot } = {}

    public createNewSingleGame(playerID: UUID): UUID {
        const id: UUID = randomUUID()
        this.slots[id] = {
            gameState: new GameState(playerID, 'single'),
            connections: new Map(),
            mode: 'single',
            players: [playerID],
            updateInterval: null,
            gameName: id,
            restartRequests: new Set()
        }
        return id
    }

    public createNewDoubleGame(playerID: UUID, gameName: string): UUID {
        const id: UUID = randomUUID()
        this.slots[id] = {
            gameState: new GameState(playerID, 'double'),
            connections: new Map(),
            mode: 'double',
            players: [playerID],
            updateInterval: null,
            gameName,
            restartRequests: new Set()
        }
        return id
    }

    public joinGame(playerID: UUID, gameID: UUID): boolean {
        if (!this.slots[gameID]) return false
        if (this.slots[gameID].players.length >= 2) return false
        this.slots[gameID].players.push(playerID)
        this.slots[gameID].gameState.addPlayer(playerID)
        return true
    }

    public getAvailableGames(searchGameID?: string): { name: string; id: UUID }[] {
        const availableGames: { name: string; id: UUID }[] = []
        for (const [gameID, gameInfo] of Object.entries(this.slots)) {
            if (gameInfo.mode === 'double') {
                if (searchGameID && !gameInfo.gameName.includes(searchGameID)) continue
                if (gameInfo.players.length < 2) availableGames.push({ name: gameInfo.gameName, id: gameID as UUID })
            }
        }
        return availableGames
    }

    public getSlot(gameID: UUID): GameSlot | undefined {
        return this.slots[gameID]
    }

    public startLoop(gameID: UUID): void {
        const slot = this.slots[gameID]
        if (!slot || slot.updateInterval) return
        this._startLoop(gameID)
    }

    public restartGame(playerID: UUID, gameID: UUID): void {
        const slot = this.slots[gameID]
        if (!slot) return
        if (!slot.players[0]) return

        if (slot.mode === 'single') {
            if (slot.updateInterval) clearInterval(slot.updateInterval)
            slot.gameState = new GameState(slot.players[0], slot.mode)
            slot.updateInterval = null
            this._startLoop(gameID)
            return
        }

        slot.restartRequests.add(playerID)

        if (slot.restartRequests.size < 2) {
            slot.connections.get(playerID)?.send(JSON.stringify({ type: "restart_waiting" }))
            slot.connections.forEach((ws, pid) => {
                if (pid !== playerID) {
                    ws.send(JSON.stringify({ type: "restart_requested" }))
                }
            })
            return
        }

        slot.restartRequests.clear()
        if (slot.updateInterval) clearInterval(slot.updateInterval)
        slot.gameState = new GameState(slot.players[0], slot.mode)
        if (slot.players[1]) slot.gameState.addPlayer(slot.players[1])
        slot.updateInterval = null
        this._startLoop(gameID)
    }

    public clearSlot(gameID: UUID): void {
        if (!this.slots[gameID]) return
        if (this.slots[gameID].updateInterval) clearInterval(this.slots[gameID].updateInterval)
        delete this.slots[gameID]
    }

    private _startLoop(gameID: UUID): void {
        const slot = this.slots[gameID]
        if(!slot) return
        let lastTime = Date.now()
        slot.updateInterval = setInterval(() => {
            const now = Date.now()
            const dt = now - lastTime
            lastTime = now
            slot.gameState.Tick(dt)
            const info = slot.gameState.getGameInfo()
            slot.connections.forEach(ws => ws.send(info))
            slot.gameState.clearOutOfBoundsElements()
        }, 10)
    }
}

export default GameRegistry
export type { GameSlot }
