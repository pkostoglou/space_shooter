import express from 'express'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import cors from 'cors'
import initSocket from './service/socket.js'
import db from './db/index.js'
import { addRoutes } from './routes/index.js'
import config from './config/index.js'

const app = express()
const port = config.port

const server = createServer(app);
const wss = new WebSocketServer({ server });
app.use(cors());
app.use(express.json());

addRoutes(app, db)
initSocket(wss)

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
