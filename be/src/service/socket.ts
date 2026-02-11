import type { WebSocket, WebSocketServer } from "ws";
import GameState from "./GameState/GameState.js";
import type { Position } from "../domains/gameTypes.js";
import { randomUUID } from "node:crypto";
import type { UUID } from "node:crypto";

const gameStates: {
    [key: UUID]: {
        gameState: GameState,
        connection: WebSocket
    }
} = {}

let gsUpdateInterval: NodeJS.Timeout

/*  
    Create the game logic loop and return the interval ID
    Step 1. Run the game state logic routine
    Step 2. Send the new game state
    Step 3. clean out of bounds elements
*/
const setUpdateInterval = (gs: GameState, ws: WebSocket): NodeJS.Timeout => {
    return setInterval((gs: GameState, ws: WebSocket) => {
        gs.Tick()
        const gameInfo = gs.getGameInfo()
        ws.send(gameInfo)
        gs.clearOutOfBoundsElements()
    }, 10, gs, ws)
}

// Create a UUID and assign to it a new game state and it's websocket connection
const assignNewGameState = (ws: WebSocket): UUID => {
    const UUID: UUID = randomUUID()
    gameStates[UUID] = {
        gameState: new GameState(),
        connection: ws
    }
    return UUID
}

const clearGameState = (UUID: UUID): void => {
    clearInterval(gsUpdateInterval)
    delete gameStates[UUID]
}

const initSocket = (wss: WebSocketServer) => {
    wss.on('connection', (ws, req) => {
        const UUID = assignNewGameState(ws)
        ws.on('message', (message) => {
            if (!gameStates[UUID]) return
            const gs = gameStates[UUID].gameState
            const m: any = JSON.parse(message.toString())

            // Restart the game state
            if (m.type == "restart") {
                gameStates[UUID].gameState = new GameState()
                clearInterval(gsUpdateInterval)
                gsUpdateInterval = setUpdateInterval(gameStates[UUID].gameState, gameStates[UUID].connection)
                return
            }

            // Handle player movement
            if (m.playerMovement) {
                gs.movePlayer(m.playerMovement)
            }

            // Update the target (mouse most likely) position
            if (m.targetPosition) {
                const targetPosition: Position = {
                    x: m.targetPosition.targetPositionX,
                    y: m.targetPosition.targetPositionY
                }
                gs.setTargetPosition(targetPosition)
            }
            if (m.mouseIsBeingPressed) {
                gs.playerIsShooting()
            } else {
                gs.playerIsNotShooting()
            }

        });
        if (gameStates[UUID]) {
            gsUpdateInterval = setUpdateInterval(gameStates[UUID].gameState, gameStates[UUID].connection)
        } else {
            console.log("Something went wrong")
        }

        // Handle disconnect
        ws.on('close', () => {
            console.log(`Player disconnected`);
            clearGameState(UUID)

        });

        // Handle errors
        ws.on('error', (error) => {
            console.error(`WebSocket error for player :`, error);
            clearGameState(UUID)
        });

    });
}

export default initSocket