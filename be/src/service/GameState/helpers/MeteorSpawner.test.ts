import { describe, it, expect, vi, afterEach } from 'vitest'
import { spawnMeteorIfNeeded } from './MeteorSpawner.js'

const windowSize = { width: 1400, height: 900 }

describe('spawnMeteorIfNeeded', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('returns null when random is below the spawn threshold (0.96)', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.5)
        expect(spawnMeteorIfNeeded(0, windowSize)).toBeNull()
    })

    it('returns a Meteor when random is above 0.96', () => {
        // First call (spawn check) > 0.96, subsequent calls for position
        vi.spyOn(Math, 'random')
            .mockReturnValueOnce(0.97)  // passes spawn check
            .mockReturnValueOnce(0.1)   // creationSeed <= 0.25 → top edge
            .mockReturnValue(0.5)       // position values
        const meteor = spawnMeteorIfNeeded(0, windowSize)
        expect(meteor).not.toBeNull()
    })

    it('spawns from top edge when creationSeed <= 0.25', () => {
        vi.spyOn(Math, 'random')
            .mockReturnValueOnce(0.97)  // spawn check
            .mockReturnValueOnce(0.1)   // creationSeed = 0.1 → top edge
            .mockReturnValueOnce(0.5)   // x position
            .mockReturnValueOnce(0.5)   // target x
        const meteor = spawnMeteorIfNeeded(0, windowSize)
        expect(meteor).not.toBeNull()
        // Starting y should be 0 (top edge)
        expect(meteor!.getPosition().y).toBe(0)
    })

    it('spawns from right edge when creationSeed <= 0.5', () => {
        vi.spyOn(Math, 'random')
            .mockReturnValueOnce(0.97)  // spawn check
            .mockReturnValueOnce(0.4)   // creationSeed = 0.4 → right edge
            .mockReturnValueOnce(0.5)   // y position
            .mockReturnValueOnce(0.5)   // target y
        const meteor = spawnMeteorIfNeeded(0, windowSize)
        expect(meteor).not.toBeNull()
        // Starting x should be windowSize.width + 20 = 1420
        expect(meteor!.getPosition().x).toBe(windowSize.width + 20)
    })

    it('spawns from bottom edge when creationSeed <= 0.75', () => {
        vi.spyOn(Math, 'random')
            .mockReturnValueOnce(0.97)  // spawn check
            .mockReturnValueOnce(0.6)   // creationSeed = 0.6 → bottom edge
            .mockReturnValueOnce(0.5)   // x position
            .mockReturnValueOnce(0.5)   // target x
        const meteor = spawnMeteorIfNeeded(0, windowSize)
        expect(meteor).not.toBeNull()
        // Starting y should be windowSize.height + 20 = 920
        expect(meteor!.getPosition().y).toBe(windowSize.height + 20)
    })

    it('spawns from left edge when creationSeed > 0.75', () => {
        vi.spyOn(Math, 'random')
            .mockReturnValueOnce(0.97)  // spawn check
            .mockReturnValueOnce(0.9)   // creationSeed = 0.9 → left edge
            .mockReturnValueOnce(0.5)   // y position
            .mockReturnValueOnce(0.5)   // target y
        const meteor = spawnMeteorIfNeeded(0, windowSize)
        expect(meteor).not.toBeNull()
        // Starting x should be 0 (left edge)
        expect(meteor!.getPosition().x).toBe(0)
    })

    it('scales meteor speed with score (speed = floor(score/1000) + 1)', () => {
        // At score=2000, speed should be floor(2000/1000)+1 = 3
        // We can verify by checking the meteor moves faster than at score=0
        vi.spyOn(Math, 'random')
            .mockReturnValueOnce(0.97)
            .mockReturnValueOnce(0.1)   // top edge
            .mockReturnValueOnce(0.4)
            .mockReturnValue(0.5)

        const slowMeteor = spawnMeteorIfNeeded(0, windowSize)

        vi.restoreAllMocks()
        vi.spyOn(Math, 'random')
            .mockReturnValueOnce(0.97)
            .mockReturnValueOnce(0.1)   // top edge
            .mockReturnValueOnce(0.4)
            .mockReturnValue(0.5)

        const fastMeteor = spawnMeteorIfNeeded(2000, windowSize)

        expect(slowMeteor).not.toBeNull()
        expect(fastMeteor).not.toBeNull()

        // Capture positions before movement
        const slowBefore = { ...slowMeteor!.getPosition() }
        const fastBefore = { ...fastMeteor!.getPosition() }

        // Advance both by one tick
        slowMeteor!.passiveMovement(16)
        fastMeteor!.passiveMovement(16)

        // Compute Euclidean distance traveled from the actual pre-movement position
        const slowAfter = slowMeteor!.getPosition()
        const fastAfter = fastMeteor!.getPosition()
        const slowDist = Math.sqrt((slowAfter.x - slowBefore.x) ** 2 + (slowAfter.y - slowBefore.y) ** 2)
        const fastDist = Math.sqrt((fastAfter.x - fastBefore.x) ** 2 + (fastAfter.y - fastBefore.y) ** 2)

        expect(fastDist).toBeGreaterThan(slowDist)
    })
})
