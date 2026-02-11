import mongoose from "mongoose";
import config from "../../config/index.js";

const MONGO_URI = config.mongoURI//'mongodb://user:pass@localhost:27017/db?authSource=admin';
mongoose.connect(MONGO_URI).then(() => console.log("Connected to Mongo!")).catch((err) => console.log("Lol nope :", err))

const GameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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

const Game = mongoose.model("Game", GameSchema)

export{
    Game
}