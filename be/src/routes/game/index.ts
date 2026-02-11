import type { Express } from "express"

const gameRoutes = (app: Express, db: any) => {
    app.post('/game', async (req, res) => {
        const {
            name,
            score
        } = req.body

        const game = new db.game({
            name,
            score
        })
        await game.save()
        res.json({
            message: "Game saved succesfully!"
        })
    })

    app.get('/game', async (req, res) => {
        try {
            const games = await db.game.find().sort({ score: -1 }).limit(20)
            res.json(games)
        } catch (e) {
            res.status(500).json({ error: "Cant" })
        }
    })
}

export {gameRoutes}