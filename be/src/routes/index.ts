import { gameRoutes } from "./game/index.js";
import type { Express } from "express";
import type { TGameManager } from "../domains/gameTypes.js";

const addRoutes = (app: Express, db: any, gameStateManager: TGameManager) => {
    gameRoutes(app, db, gameStateManager)
}

export {addRoutes}

