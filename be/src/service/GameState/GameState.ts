import type { Position, Size } from "../../domains/gameTypes.js"
import Player from "./Player.js"
import Projectile from "./Projectile.js"
import Meteor from "./Metero.js"
import type { UUID } from "node:crypto"

class GameState {
    private projectiles: Projectile[]
    private meteors: Meteor[]
    private players: {
        [key: UUID]: {
            targetPosition: Position | null,
            player: Player
        }
    }
    private gameId: number
    private isGameActive: boolean
    private score: number
    private windowSize: Size
    private gameMode: 'single' | 'double'
    private isGameOver: boolean

    constructor(playerID: UUID, gameMode: 'single' | 'double') {
        this.gameId = 1
        this.projectiles = []
        this.players = {}
        this.players[playerID] = {
            player: new Player({ x: 450, y: 450 }),
            targetPosition: null
        }
        this.meteors = []
        this.score = 0
        this.windowSize = {
            width: 1400,
            height: 900
        }
        this.gameMode = gameMode
        this.isGameOver = false
        if (gameMode == 'single') {
            this.isGameActive = true
        } else {
            this.isGameActive = false
        }
    }

    private handleCollisions() {
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
            for (const [key, value] of Object.entries(this.players)) {
                if (currentMeteor.detectCollisionWithElement(value.player)) {
                    this.isGameActive = false
                    this.isGameOver = true
                }
            }

        }
        if (meteorsToRemove.length > 0) {
            this.meteors = this.meteors.filter((_, i) => !meteorsToRemove.includes(i))
        }
        if (projectilesToRemove.length > 0) {
            this.projectiles = this.projectiles.filter((_, i) => !projectilesToRemove.includes(i))
        }
    }

    public movePlayer(playerID: UUID, movement: { horizontal: number, vertical: number }, deltaTime: number) {
        if (!this.isGameActive) return
        this.players[playerID]?.player.move(movement, deltaTime)
    }

    public setTargetPosition(playerID: UUID, targetPosition: Position) {
        if (this.players[playerID]) this.players[playerID].targetPosition = targetPosition
    }

    public Tick(deltaTime: number) {
        if (!this.isGameActive) return

        //Move projectiles
        this.projectiles.forEach(projectile => {
            projectile.passiveMovement(deltaTime)
        });

        // Move meteors
        this.meteors.forEach(meteor => {
            meteor.passiveMovement(deltaTime)
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
        for (const [key, value] of Object.entries(this.players)) {
            const player = value.player
            if (player.canShoot() && value.targetPosition) {
                player.resetShootCountdown()
                const newProjectile = new Projectile(1, player.getInfo().position, value.targetPosition)
                this.projectiles.push(newProjectile)
            }
        }

    }

    public playerIsShooting(playerID: UUID, deltaTime: number) {
        if (this.players[playerID]) this.players[playerID].player.shootCountdown(deltaTime)
    }

    public playerIsNotShooting(playerID: UUID) {
        if (this.players[playerID]) this.players[playerID].player.resetShootCountdown()

    }

    public getGameInfo() {

        const playersInfo = []

        for (const [key, value] of Object.entries(this.players)) {
            playersInfo.push(value.player.getInfo())
        }

        return JSON.stringify({
            projectiles: this.projectiles,
            meteors: this.meteors,
            player: playersInfo,
            isGameActive: this.isGameActive,
            isGameOver: this.isGameOver,
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

    public addPlayer(playerID: UUID): void {
        this.players[playerID] = {
            player: new Player({ x: 850, y: 450 }),
            targetPosition: null
        }
        this.isGameActive = true
    }
}

export default GameState