import type { Document } from "mongoose";

export interface IGame extends Document {
    name: string;
    score: number;
    gameType: 'single' | 'double';
    createdAt: Date;
}

export interface IGameRepository {
    saveScore: (name: string, score: number, gameType: 'single' | 'double') => Promise<{ rank: number }>;
    getLeaderboard: (gameType: 'single' | 'double') => Promise<IGame[]>;
}

export interface Database {
    game: IGameRepository;
}
