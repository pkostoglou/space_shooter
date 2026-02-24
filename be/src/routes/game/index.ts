import { Router } from "express";
import { createScoreRouter } from "./score.js";
import { createLifecycleRouter } from "./lifecycle.js";
import type { Database } from "../../domains/db.js";
import type { TGameManager } from "../../domains/gameTypes.js";

const gameRoutes = (db: Database, gameStateManager: TGameManager) => {
    const router = Router()
    router.use(createScoreRouter(db))
    router.use(createLifecycleRouter(gameStateManager))
    return router
}

export default gameRoutes
