import { createGameRepository } from "./repositories/index.js";
import type { Database } from "../domains/db.js";
import { connectDB } from "./connection.js";

export function createDatabase(): Database {
    return {
        game: createGameRepository(),
    }
}

const initializeDb = async (mongoURI: string): Promise<Database> => {
    try {
        await connectDB(mongoURI)
        return createDatabase()
    } catch (err) {
        throw err
    }
}

export default initializeDb
