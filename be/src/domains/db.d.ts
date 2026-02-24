import type { Document } from "mongoose";

export interface IGame extends Document {
    name: string;
    score: number;
    createdAt: Date;
}

export interface IGameRepository {
    saveScore: (name: string, score: number) => Promise<{ rank: number }>;
    getLeaderboard: () => Promise<IGame[]>;
}

export interface Database {
    game: IGameRepository;
}
