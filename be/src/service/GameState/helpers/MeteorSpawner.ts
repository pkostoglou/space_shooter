import Meteor from "../Meteor.js"
import type { Size } from "../../../domains/gameTypes.js"

function spawnMeteorIfNeeded(score: number, windowSize: Size): Meteor | null {
    if (Math.random() > 0.96) {
        let newMeteorPosition = { x: 0, y: 0 }
        let newMeteorTargetPosition = { x: 0, y: 0 }
        const creationSeed = Math.random()
        if (creationSeed <= 0.25) {
            newMeteorPosition = { x: Math.random() * windowSize.width, y: 0 }
            newMeteorTargetPosition = { x: Math.random() * windowSize.width, y: windowSize.height }
        } else if (creationSeed <= 0.5) {
            newMeteorPosition = { x: windowSize.width + 20, y: Math.random() * windowSize.height }
            newMeteorTargetPosition = { x: 0, y: Math.random() * windowSize.height }
        } else if (creationSeed <= 0.75) {
            newMeteorPosition = { x: Math.random() * windowSize.width, y: windowSize.height + 20 }
            newMeteorTargetPosition = { x: Math.random() * windowSize.width, y: 0 }
        } else {
            newMeteorPosition = { x: 0, y: Math.random() * windowSize.height }
            newMeteorTargetPosition = { x: windowSize.width, y: Math.random() * windowSize.height }
        }
        return new Meteor(newMeteorPosition, newMeteorTargetPosition, Math.floor(score / 1000) + 1)
    }
    return null
}

export { spawnMeteorIfNeeded }
