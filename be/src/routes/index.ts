import gameRoutes from "./game/index.js";
import type { Express } from "express";
import type { TGameManager } from "../domains/gameTypes.js";
import type { Database } from "../domains/db.js";

const addRoutes = (app: Express, db: Database, gameStateManager: TGameManager) => {
    app.use('/api/game', gameRoutes(db, gameStateManager))
}

export {addRoutes}

