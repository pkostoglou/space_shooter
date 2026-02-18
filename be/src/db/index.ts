import { Game } from "./models/index.js";
import type { Database } from "../domains/db.js";
import { connectDB } from "./connection.js";

const db:Database = {
    game: Game
}

const initializeDb = async(MongoURI: string):Promise<Database> => {
    try{
        await connectDB(MongoURI)
        return db
    } catch(err) {
        throw err
    }
    
}

export default initializeDb