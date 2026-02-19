import type { UUID } from "node:crypto"

type Position = {
    x: number,
    y: number
}

type Size = {
    width: number,
    height: number
}

interface TGameManager {
    createNewSingleGame: (UUID:UUID) => UUID,
    createNewDoubleGame: (UUID:UUID, gameName: string) => UUID,
    joinGame: (UUID:UUID, UUID:UUID) => boolean,
    getAvailableGames: (gameID: string | undefined) => {name: string, id: UUID}[]
}

export { Position, Size, TGameManager }