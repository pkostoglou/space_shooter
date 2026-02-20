import type { WebSocketServer } from "ws"
import type { TGameManager, Position } from "../domains/gameTypes.js"
import type { UUID } from "node:crypto"
import { extractCookies } from "../utils/index.js"
import GameRegistry from "./GameRegistry.js"

const initializeGameStatesManager = (
    wss: WebSocketServer,
    registry: GameRegistry = new GameRegistry()
): TGameManager => {

    wss.on('connection', (ws, req) => {
        if (!req.headers.cookie) return
        const cookies = extractCookies(req.headers.cookie)
        if (!cookies.userID || !cookies.gameID) return
        const gameID = cookies.gameID as UUID
        const playerID = cookies.userID as UUID
        const slot = registry.getSlot(gameID)
        if (!slot) return
        slot.connections.push(ws)
        registry.startLoop(gameID)

        let lastTime = Date.now()
        ws.on('message', (message) => {
            const currentTime = Date.now()
            const deltaTime = currentTime - lastTime
            lastTime = currentTime
            const m: any = JSON.parse(message.toString())

            if (m.type === 'restart') {
                registry.restartGame(playerID, gameID)
                return
            }

            const gs = registry.getSlot(gameID)?.gameState
            if (!gs) return

            if (m.playerMovement) {
                gs.movePlayer(playerID, m.playerMovement, deltaTime)
            }

            if (m.targetPosition) {
                const targetPosition: Position = {
                    x: m.targetPosition.targetPositionX,
                    y: m.targetPosition.targetPositionY
                }
                gs.setTargetPosition(playerID, targetPosition)
            }

            if (m.mouseIsBeingPressed) {
                gs.playerIsShooting(playerID, deltaTime)
            } else {
                gs.playerIsNotShooting(playerID)
            }
        })

        ws.on('close', () => {
            console.log(`Player disconnected!`)
            registry.clearSlot(gameID)
        })

        ws.on('error', (error) => {
            console.error(`WebSocket error for player :`, error)
            registry.clearSlot(gameID)
        })
    })

    return registry
}

export default initializeGameStatesManager
