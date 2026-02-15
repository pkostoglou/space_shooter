import type { Position } from "../../domains/gameTypes.js"
import Element from "./Element.js"

const PLAYER_FIRERATE_BASELINE = 0.5

class Player extends Element {
    public playerId: number
    private speed: number
    private angle: number
    // miliseconds for a shot
    private fireRate: number

    constructor(initialPosition: Position) {
        super(initialPosition, { width: 40, height: 100 })
        this.playerId = 1
        this.speed = 2
        this.fireRate = PLAYER_FIRERATE_BASELINE
        this.angle = Math.PI / 2
    }

    public move(movement: { horizontal: number, vertical: number } ,deltaTime:number) {
        if (movement.vertical != 0) {
            this.currentPosition.y += this.speed * movement.vertical * (deltaTime/16)
        }
        if (movement.horizontal != 0) {
            this.currentPosition.x += this.speed * movement.horizontal * (deltaTime/16)
        }
        if (movement.horizontal == 0) {
            if (movement.vertical == 1) {
                this.angle = Math.PI
            } else if (movement.vertical == -1) {
                this.angle = 0
            }
        } else {
            if (movement.vertical == 0) {
                this.angle = Math.PI / 2 * movement.horizontal
            } else if (movement.vertical == -1) {
                this.angle = Math.PI / 4 * movement.horizontal
            } else {
                this.angle = 3 * Math.PI / 4 * movement.horizontal
            }
        }
    }

    public getInfo() {
        return {
            position: this.currentPosition,
            angle: this.angle,
            id: this.playerId
        }
    }

    public shootCountdown(deltaTime: number) {
        this.fireRate -= deltaTime / 1000
    }

    public canShoot() {
        return this.fireRate <= 0
    }

    public resetShootCountdown() {
        this.fireRate = PLAYER_FIRERATE_BASELINE
    }
}

export default Player