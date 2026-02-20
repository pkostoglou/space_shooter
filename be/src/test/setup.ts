import mongoose from 'mongoose'
import { Game } from '../db/models/index.js'
import { beforeAll, afterAll, beforeEach } from 'vitest'

beforeAll(async () => {
    const uri = process.env['MONGO_URI_TEST']
    if (!uri) throw new Error('MONGO_URI_TEST not set — globalSetup may have failed')
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri)
    }
})

afterAll(async () => {
    await mongoose.disconnect()
})

beforeEach(async () => {
    if (mongoose.connection.readyState === 1) {
        await Game.deleteMany({})
    }
})
