import express from 'express'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import cors from 'cors'
import initSocket from './src/service/socket.ts'
import db from './src/db/index.ts'
import { addRoutes } from './src/routes/index.ts'
import config from './src/config/index.ts'

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
