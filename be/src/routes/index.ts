import { gameRoutes } from "./game/index.js";
import type { Express } from "express";

const addRoutes = (app: Express, db: any) => {
    gameRoutes(app, db)
}

export {addRoutes}

