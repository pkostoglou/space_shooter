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
    createNewDoubleGame: (UUID:UUID) => UUID,
    joinGame: (UUID:UUID, UUID:UUID) => boolean,
    getAvailableGames: () => UUID[]
}

export { Position, Size, TGameManager }