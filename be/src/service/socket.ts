import type { WebSocket, WebSocketServer } from "ws";
import GameState from "./GameState/GameState.js";
import type { Position, TGameManager } from "../domains/gameTypes.js";
import { randomUUID } from "node:crypto";
import type { UUID } from "node:crypto";
import { extractCookies } from "../utils/index.js";

const initializeGameStatesManager = (wss: WebSocketServer):TGameManager => {
    const gameStates: {
        [key: UUID]: {
            gameState: GameState,
            mode: 'single' | 'double'
            connections: WebSocket[],
            players: UUID[],
            updateInterval: NodeJS.Timeout | null
        }
    } = {}

    /*  
        Create the game logic loop and return the interval ID. In the loop calculate the delta of the time between intervals for better distance updates
        Step 1. Run the game state logic routine
        Step 2. Send the new game state
        Step 3. clean out of bounds elements
    */
    const setUpdateInterval = (gs: GameState, connections: WebSocket[]): NodeJS.Timeout => {
        let lastTime = Date.now();
        return setInterval((gs: GameState, connections: WebSocket[]) => {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            gs.Tick(deltaTime)
            const gameInfo = gs.getGameInfo()
            connections.forEach(ws => ws.send(gameInfo))
            gs.clearOutOfBoundsElements()
        }, 10, gs, connections)
    }

    const clearGameState = (UUID: UUID): void => {
        if (!gameStates[UUID]) return
        if (gameStates[UUID].updateInterval) clearInterval(gameStates[UUID].updateInterval)
        delete gameStates[UUID]
    }

    const createNewSingleGame = (playerID: UUID): UUID => {
        const UUID: UUID = randomUUID()
        gameStates[UUID] = {
            gameState: new GameState(playerID),
            connections: [],
            mode: 'single',
            players: [playerID],
            updateInterval: null
        }
        return UUID
    }

    const createNewDoubleGame = (playerID: UUID): UUID => {
        const UUID: UUID = randomUUID()
        gameStates[UUID] = {
            gameState: new GameState(playerID),
            connections: [],
            mode: 'double',
            players: [playerID],
            updateInterval: null
        }
        return UUID
    }

    const joinGame = (playerID: UUID, gameID: UUID): boolean => {
        if (!gameStates[gameID]) return false
        if (gameStates[gameID].players.length > 2) return false
        gameStates[gameID].players.push(playerID)
        gameStates[gameID].gameState.addPlayer(playerID)
        return true
    }

    const getAvailableGames = ():UUID[] => {
        const availableGames:UUID[] = []
        for (const [gameID, gameInfo] of Object.entries(gameStates)) {
            if(gameInfo.mode=='double') {
                if(gameInfo.players.length <2) availableGames.push(gameID as UUID)
            }
        }

        return availableGames
    }

    wss.on('connection', (ws, req) => {
        if (!req.headers.cookie) return
        // Extract from the cookies the gameID and the playerID
        const cookies = extractCookies(req.headers.cookie)
        if (!cookies.userID || !cookies.gameID) return
        const gameID = cookies.gameID as UUID
        const playerID = cookies.userID as UUID
        if (!gameStates[gameID]) return
        gameStates[gameID].connections.push(ws)
        if (gameStates[gameID] && !gameStates[gameID].updateInterval) {
            gameStates[gameID].updateInterval = setUpdateInterval(gameStates[gameID].gameState, gameStates[gameID].connections)
        }

        let lastTime = Date.now()
        ws.on('message', (message) => {
            const currentTime = Date.now()
            const deltaTime = currentTime - lastTime
            lastTime = currentTime
            if (!gameStates[gameID]) return
            const gs = gameStates[gameID].gameState
            const m: any = JSON.parse(message.toString())

            // Restart the game state
            if (m.type == "restart") {
                gameStates[gameID].gameState = new GameState(playerID)
                if (gameStates[gameID].updateInterval) clearInterval(gameStates[gameID].updateInterval)
                gameStates[gameID].updateInterval = setUpdateInterval(gameStates[gameID].gameState, gameStates[gameID].connections)
                return
            }

            // Handle player movement
            if (m.playerMovement) {
                gs.movePlayer(playerID, m.playerMovement, deltaTime)
            }

            // Update the target (mouse most likely) position
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

        });

        // Handle disconnect
        ws.on('close', () => {
            console.log(`Player disconnected`);
            clearGameState(gameID)

        });

        // Handle errors
        ws.on('error', (error) => {
            console.error(`WebSocket error for player :`, error);
            clearGameState(gameID)
        });

    });

    return {
        createNewSingleGame,
        createNewDoubleGame,
        joinGame,
        getAvailableGames
    }
}

export default initializeGameStatesManager