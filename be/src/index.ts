import express, { type CookieOptions } from 'express'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import cors from 'cors'
import initializeGameStatesManager from './service/socket.js'
import db from './db/index.js'
import { addRoutes } from './routes/index.js'
import config from './config/index.js'

const app = express()
app.use(cors({
    origin: config.origin,
    credentials: true
}));
const port = config.port

const server = createServer(app);
const wss = new WebSocketServer({ server });
app.use(express.json());

const gameStateManager = initializeGameStatesManager(wss)
addRoutes(app, db, gameStateManager)

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
