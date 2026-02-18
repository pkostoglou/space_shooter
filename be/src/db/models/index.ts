import mongoose, {Schema} from "mongoose";
import type { IGame } from "../../domains/db.js";


const GameSchema = new Schema<IGame>({
    name: {
        type: String,
        required: true,
        trim:true
    },
    score: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

export const Game = mongoose.model<IGame>("Game", GameSchema)