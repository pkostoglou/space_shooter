import type { Document, Model } from "mongoose";

export interface IGame extends Document {
    name: string;
    score: number;
    createdAt: Date;
}

export interface Database {
    game: Model<IGame>
}