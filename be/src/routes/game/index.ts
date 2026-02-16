import type { Express } from "express"
import { randomUUID } from "node:crypto";
import type { TGameManager } from "../../domains/gameTypes.js";

const gameRoutes = (app: Express, db: any, gameStateManager: TGameManager) => {
    app.get('/api/game/double', async (req, res) => {
        try {
            const availableGames = gameStateManager.getAvailableGames()
            res.status(200).json({ availableGames })
        } catch (e) {

        }
    })
    app.post('/api/game', async (req, res) => {
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

    app.get('/api/game', async (req, res) => {
        try {
            const games = await db.game.find().sort({ score: -1 }).limit(20)
            res.json(games)
        } catch (e) {
            res.status(500).json({ error: "Cant" })
        }
    })

    app.post('/api/game/single', async (req, res) => {
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

    app.post('/api/game/double', async (req, res) => {
        try {
            const userID = randomUUID()
            const gameID = gameStateManager.createNewDoubleGame(userID)
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

    app.post('/api/game/join', async (req, res) => {
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
}

export { gameRoutes }