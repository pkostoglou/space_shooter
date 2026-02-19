import type Meteor from "../Meteor.js"
import type Projectile from "../Projectile.js"
import type Player from "../Player.js"
import type { UUID } from "node:crypto"
import type { Position } from "../../../domains/gameTypes.js"

type PlayerMap = { [key: UUID]: { player: Player; targetPosition: Position | null } }

type CollisionResult = {
    meteors: Meteor[]
    projectiles: Projectile[]
    scoreIncrement: number
    gameOver: boolean
}

function detectCollisions(
    meteors: Meteor[],
    projectiles: Projectile[],
    players: PlayerMap
): CollisionResult {
    const meteorsToRemove: number[] = []
    const projectilesToRemove: number[] = []
    let scoreIncrement = 0
    let gameOver = false

    for (let i = 0; i < meteors.length; i++) {
        const currentMeteor = meteors[i]
        if (!currentMeteor) continue
        for (let j = 0; j < projectiles.length; j++) {
            const currentProjectile = projectiles[j]
            if (!currentProjectile) continue
            if (currentMeteor.detectCollisionWithElement(currentProjectile)) {
                meteorsToRemove.push(i)
                projectilesToRemove.push(j)
                scoreIncrement += 100
                break
            }
        }
        for (const [, value] of Object.entries(players)) {
            if (currentMeteor.detectCollisionWithElement(value.player)) {
                gameOver = true
            }
        }
    }

    return {
        meteors: meteors.filter((_, i) => !meteorsToRemove.includes(i)),
        projectiles: projectiles.filter((_, i) => !projectilesToRemove.includes(i)),
        scoreIncrement,
        gameOver
    }
}

export { detectCollisions }
export type { CollisionResult }
