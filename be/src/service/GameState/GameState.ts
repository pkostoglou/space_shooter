import type { Position, Size } from "../../domains/gameTypes.js"
import Player from "./Player.js"
import Projectile from "./Projectile.js"
import Meteor from "./Metero.js"

class GameState {
    private projectiles: Projectile[]
    private meteors: Meteor[]
    private players: Player
    private gameId: number
    private isGameActive: boolean
    private score: number
    private windowSize: Size
    private targetPosition: Position | null

    constructor() {
        this.gameId = 1
        this.projectiles = []
        this.players = new Player();
        this.meteors = []
        this.isGameActive = true
        this.score = 0
        this.windowSize = {
            width: 1400,
            height: 900
        }
        this.targetPosition = null
    }

    private handleCollisions(){
        const meteorsToRemove: number[] = []
        const projectilesToRemove: number[] = []

        // Iterate meteors and projectiles to check collisions
        for (let i = 0; i < this.meteors.length; i++) {
            const currentMeteor = this.meteors[i]
            if (!currentMeteor) continue
            for (let j = 0; j < this.projectiles.length; j++) {
                const currentProjectile = this.projectiles[j]
                if (!currentProjectile) continue
                if (currentMeteor.detectCollisionWithElement(currentProjectile)) {
                    meteorsToRemove.push(i)
                    projectilesToRemove.push(j)
                    this.score += 100
                    break
                }
            }
            // Check player with meteor collision
            if (currentMeteor.detectCollisionWithElement(this.players)) {
                this.isGameActive = false
            }
        }
        if (meteorsToRemove.length > 0) {
            this.meteors = this.meteors.filter((_, i) => !meteorsToRemove.includes(i))
        }
        if (projectilesToRemove.length > 0) {
            this.projectiles = this.projectiles.filter((_, i) => !projectilesToRemove.includes(i))
        }
    }

    public movePlayer(movement: { horizontal: number, vertical: number }) {
        if (!this.isGameActive) return
        this.players.move(movement)
    }

    public setTargetPosition(targetPosition: Position) {
        this.targetPosition = targetPosition
    }

    public Tick() {
        if (!this.isGameActive) return

        //Move projectiles
        this.projectiles.forEach(projectile => {
            projectile.passiveMovement()
        });

        // Move meteors
        this.meteors.forEach(meteor => {
            meteor.passiveMovement()
        });

        this.handleCollisions()

        // Create new meteor
        if (Math.random() > 0.96) {
            let newMeteorPosition = {
                x: 0,
                y: 0
            }
            let newMeteorTargetPosition = {
                x: 0,
                y: 0
            }
            // Choose at random one of the 4 sides of the screen to create the meteor.
            // Target position will be on the opposite side
            const creationSeed = Math.random()
            if (creationSeed <= 0.25) {
                newMeteorPosition = {
                    x: Math.random() * this.windowSize.width,
                    y: 0
                }
                newMeteorTargetPosition = {
                    x: Math.random() * this.windowSize.width,
                    y: this.windowSize.height
                }

            } else if (creationSeed <= 0.5) {
                newMeteorPosition = {
                    x: this.windowSize.width + 20,
                    y: Math.random() * this.windowSize.height
                }
                newMeteorTargetPosition = {
                    x: 0,
                    y: Math.random() * this.windowSize.height
                }
            } else if (creationSeed <= 0.75) {
                newMeteorPosition = {
                    x: Math.random() * this.windowSize.width,
                    y: this.windowSize.height + 20
                }
                newMeteorTargetPosition = {
                    x: Math.random() * this.windowSize.width,
                    y: 0
                }
            } else {
                newMeteorPosition = {
                    x: 0,
                    y: Math.random() * this.windowSize.height
                }
                newMeteorTargetPosition = {
                    x: this.windowSize.width,
                    y: Math.random() * this.windowSize.height
                }
            }
            const newMeteor = new Meteor(newMeteorPosition, newMeteorTargetPosition, Math.floor(this.score / 1000) + 1)
            this.meteors.push(newMeteor)
        }

        // Create new projectile
        if (this.players.canShoot() && this.targetPosition) {
            this.players.resetShootCountdown()
            const newProjectile = new Projectile(1, this.players.getInfo().position, this.targetPosition)
            this.projectiles.push(newProjectile)
        }
    }

    public playerIsShooting() {
        this.players.shootCountdown()
    }

    public playerIsNotShooting() {
        this.players.resetShootCountdown()
    }

    public getGameInfo() {
        return JSON.stringify({
            projectiles: this.projectiles,
            meteors: this.meteors,
            player: this.players.getInfo(),
            isGameActive: this.isGameActive,
            score: this.score
        })
    }

    public clearOutOfBoundsElements() {
        this.projectiles = this.projectiles.filter(projectile => !projectile.isOutOfBound())
        this.meteors = this.meteors.filter(meteor => !meteor.isOutOfBound())
    }

    public getGameId(): number {
        return this.gameId
    }
}

export default GameState