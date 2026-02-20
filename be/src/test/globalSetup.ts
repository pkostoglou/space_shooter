import { MongoMemoryServer } from 'mongodb-memory-server'

let mongod: MongoMemoryServer

export async function setup() {
    mongod = await MongoMemoryServer.create()
    process.env['MONGO_URI_TEST'] = mongod.getUri()
}

export async function teardown() {
    await mongod.stop()
}
