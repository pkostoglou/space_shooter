import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { createApp } from './app.js'
import initializeGameStatesManager from './service/socket.js'
import initializeDb from './db/index.js'
import config from './config/index.js'

const startServer = async () => {
    const server = createServer()
    const wss = new WebSocketServer({ server })
    const gameStateManager = initializeGameStatesManager(wss)
    const db = await initializeDb(config.mongoURI)
    const app = createApp(db, gameStateManager, config.origin)
    server.on('request', app)
    server.listen(config.port, () => {
        console.log(`Example app listening on port ${config.port}`)
    })
}

startServer()
