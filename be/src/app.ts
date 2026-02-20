import express from 'express'
import cors from 'cors'
import { addRoutes } from './routes/index.js'
import type { Database } from './domains/db.js'
import type { TGameManager } from './domains/gameTypes.js'

export function createApp(db: Database, gameStateManager: TGameManager, origin: string) {
    const app = express()
    app.use(cors({ origin, credentials: true }))
    app.use(express.json())
    addRoutes(app, db, gameStateManager)
    return app
}
