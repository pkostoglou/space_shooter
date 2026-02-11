import process from "node:process"
import dotenv from "dotenv"

dotenv.config()

const port = process.env.PORT || 8000
if (!process.env.MONGO_URI) {
    console.log("MONGO_URI env varible is not set!")
    process.exit(1)
}
const mongoURI = process.env.MONGO_URI

const config = {
    port,
    mongoURI
}

export default config