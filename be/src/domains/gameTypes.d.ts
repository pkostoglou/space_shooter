import type { UUID } from "node:crypto"

type Position = {
    x: number,
    y: number
}

type Size = {
    width: number,
    height: number
}

type TGameManager = {
    createNewSingleGame: (UUID) => UUID,
    createNewDoubleGame: (UUID) => UUID,
    joinGame: (UUID, UUID) => boolean,
    getAvailableGames: () => UUID[]
}

export { Position, Size, TGameManager }