import { Game } from "../models/index.js";
import type { IGameRepository } from "../../domains/db.js";

export function createGameRepository(): IGameRepository {
    return {
        saveScore: async (name, score) => {
            const game = new Game({ name, score })
            await game.save()
            const rank = await Game.countDocuments({ score: { $gt: score } }) + 1
            return { rank }
        },
        getLeaderboard: async () => {
            return Game.find().sort({ score: -1 }).limit(20)
        }
    }
}
