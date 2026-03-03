import { Router } from "express";
import type { Database } from "../../domains/db.js";

export const createScoreRouter = (db: Database) => {
    const router = Router()

    router.get('/', async (req, res) => {
        try {
            const gameType = req.query.gameType as 'single' | 'double'
            if (!gameType || !['single', 'double'].includes(gameType)) {
                res.status(400).json({ error: "gameType query param required (single or double)" })
                return
            }
            const games = await db.game.getLeaderboard(gameType)
            res.json(games)
        } catch (e) {
            res.status(500).json({ error: "Cant" })
        }
    })

    router.post('/', async (req, res) => {
        const { name, score, gameType } = req.body
        if (!gameType || !['single', 'double'].includes(gameType)) {
            res.status(400).json({ error: "gameType required (single or double)" })
            return
        }
        const { rank } = await db.game.saveScore(name, score, gameType)
        res.json({
            message: "Game saved succesfully!",
            rank
        })
    })

    return router
}
