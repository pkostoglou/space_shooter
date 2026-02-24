import { Router } from "express";
import type { Database } from "../../domains/db.js";

export const createScoreRouter = (db: Database) => {
    const router = Router()

    router.get('/', async (_, res) => {
        try {
            const games = await db.game.getLeaderboard()
            res.json(games)
        } catch (e) {
            res.status(500).json({ error: "Cant" })
        }
    })

    router.post('/', async (req, res) => {
        const { name, score } = req.body
        const { rank } = await db.game.saveScore(name, score)
        res.json({
            message: "Game saved succesfully!",
            rank
        })
    })

    return router
}
