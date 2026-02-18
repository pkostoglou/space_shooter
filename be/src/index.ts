import express, { type CookieOptions } from 'express'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import cors from 'cors'
import initializeGameStatesManager from './service/socket.js'
import initializeDb from './db/index.js'
import { addRoutes } from './routes/index.js'
import config from './config/index.js'
const port = config.port

const startServer = async () => {
    const app = express()
    app.use(cors({
        origin: config.origin,
        credentials: true
    }));
    const server = createServer(app);
    const wss = new WebSocketServer({ server });
    app.use(express.json());

    const gameStateManager = initializeGameStatesManager(wss)
    const db = await initializeDb(config.mongoURI)
    addRoutes(app, db, gameStateManager)


    server.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startServer()