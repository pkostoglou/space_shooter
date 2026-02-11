import Element from "./Element.ts"

const PLAYER_FIRERATE_BASELINE = 150

class Player extends Element {
    public playerId: number
    private speed: number
    private angle: number
    // miliseconds for a shot
    private fireRate: number

    constructor() {
        super({ x: 450, y: 450 }, { width: 40, height: 100 })
        this.playerId = 1
        this.speed = 2
        this.fireRate = PLAYER_FIRERATE_BASELINE
        this.angle = Math.PI / 2
    }

    public move(movement: { horizontal: number, vertical: number }) {
        if (movement.vertical != 0) {
            this.currentPosition.y += this.speed * movement.vertical
        }
        if (movement.horizontal != 0) {
            this.currentPosition.x += this.speed * movement.horizontal
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

    public shootCountdown() {
        this.fireRate -= 5
    }

    public canShoot() {
        return this.fireRate <= 0
    }

    public resetShootCountdown() {
        this.fireRate = PLAYER_FIRERATE_BASELINE
    }
}

export default Player