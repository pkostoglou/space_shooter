import { Game } from "../models/index.js";
import type { IGameRepository } from "../../domains/db.js";

export function createGameRepository(): IGameRepository {
    return {
        saveScore: async (name, score, gameType) => {
            const game = new Game({ name, score, gameType })
            await game.save()
            const rank = await Game.countDocuments({ gameType, score: { $gt: score } }) + 1
            return { rank }
        },
        getLeaderboard: async (gameType) => {
            return Game.find({ gameType }).sort({ score: -1 }).limit(20)
        }
    }
}
