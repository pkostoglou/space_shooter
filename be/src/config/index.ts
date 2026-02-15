import process from "node:process"
import dotenv from "dotenv"

dotenv.config()

const port = process.env.PORT || 8000
if (!process.env.MONGO_URI) {
    console.log("MONGO_URI env varible is not set!")
    process.exit(1)
}

if (!process.env.ORIGIN) {
    console.log("ORIGIN env varible is not set!")
    process.exit(1)
}

const mongoURI = process.env.MONGO_URI
const origin =process.env.ORIGIN

const config = {
    port,
    mongoURI,
    origin
}

export default config