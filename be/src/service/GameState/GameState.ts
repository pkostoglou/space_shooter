import type { Position, Size } from "../../domains/gameTypes.js"
import Player from "./Player.js"
import Projectile from "./Projectile.js"
import Meteor from "./Meteor.js"
import type { UUID } from "node:crypto"
import { detectCollisions } from "./helpers/CollisionDetector.js"
import { spawnMeteorIfNeeded } from "./helpers/MeteorSpawner.js"

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

    public movePlayer(playerID: UUID, movement: { horizontal: number, vertical: number }, deltaTime: number) {
        if (!this.isGameActive) return
        this.players[playerID]?.player.move(movement, deltaTime)
    }

    public setTargetPosition(playerID: UUID, targetPosition: Position) {
        if (this.players[playerID]) this.players[playerID].targetPosition = targetPosition
    }

    public Tick(deltaTime: number) {
        if (!this.isGameActive) return

        this.projectiles.forEach(projectile => {
            projectile.passiveMovement(deltaTime)
        });

        this.meteors.forEach(meteor => {
            meteor.passiveMovement(deltaTime)
        });

        const result = detectCollisions(this.meteors, this.projectiles, this.players)
        this.meteors = result.meteors
        this.projectiles = result.projectiles
        this.score += result.scoreIncrement
        if (result.gameOver) {
            this.isGameActive = false
            this.isGameOver = true
        }

        const newMeteor = spawnMeteorIfNeeded(this.score, this.windowSize)
        if (newMeteor) this.meteors.push(newMeteor)

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
