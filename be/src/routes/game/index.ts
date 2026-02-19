import { randomUUID } from "node:crypto";
import type { TGameManager } from "../../domains/gameTypes.js";
import { Router } from "express";
import type { Database } from "../../domains/db.js";

const gameRoutes = (db: Database, gameStateManager: TGameManager) => {

    const gameRouter = Router()

    gameRouter.get('/double', async (req, res) => {
        let gameID:string|undefined = undefined
        const gameIDQuary = req.query.gameID
        if(typeof gameIDQuary == 'string') gameID = gameIDQuary
        const availableGames = gameStateManager.getAvailableGames(gameID)
        res.status(200).json({ availableGames })
    })

    gameRouter.post('/', async (req, res) => {
        const {
            name,
            score
        } = req.body

        const game = new db.game({
            name,
            score
        })
        await game.save()
        // Count how many scores are higher than this one
        const rank = await db.game.countDocuments({ score: { $gt: score } }) + 1
        res.json({
            message: "Game saved succesfully!",
            rank
        })
    })

    gameRouter.get('/', async (_, res) => {
        try {
            const games = await db.game.find().sort({ score: -1 }).limit(20)
            res.json(games)
        } catch (e) {
            res.status(500).json({ error: "Cant" })
        }
    })

    gameRouter.post('/single', async (_, res) => {
        try {
            const userID = randomUUID()
            const gameID = gameStateManager.createNewSingleGame(userID)
            res.cookie('userID', userID, {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 60 * 24
            })

            res.cookie('gameID', gameID, {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 60 * 24
            })

            res.status(200).json({ message: "Game created successfully" })
        } catch (e) {

        }
    })

    gameRouter.post('/double', async (req, res) => {
        try {
            const {
                gameName
            } = req.body
            const userID = randomUUID()
            const gameID = gameStateManager.createNewDoubleGame(userID, gameName)
            res.cookie('userID', userID, {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 60 * 24
            })

            res.cookie('gameID', gameID, {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 60 * 24
            })

            res.status(200).json({ message: "Game created successfully" })
        } catch (e) {

        }
    })

    gameRouter.post('/join', async (req, res) => {
        try {
            const userID = randomUUID()
            const gameID = req.body.gameID
            const success = gameStateManager.joinGame(userID, gameID)
            if (!success) res.status(404).json({ message: "Game not found" })
            res.cookie('userID', userID, {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 60 * 24
            })

            res.cookie('gameID', gameID, {
                httpOnly: true,
                secure: false,
                maxAge: 1000 * 60 * 60 * 24
            })

            res.status(200).json({ message: "Game created successfully" })
        } catch (e) {

        }
    })

    return gameRouter
}

export default gameRoutes