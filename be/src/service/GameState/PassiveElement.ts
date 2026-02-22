import type { Position, Size } from "../../domains/gameTypes.js";
import Element from "./Element.js";

class PassiveElement extends Element {
    protected a: number
    protected b: number
    protected direction: number
    protected angle: number
    protected speed: number
    protected isVertical: boolean

    constructor(initialPosition: Position, targetPosition: Position, size: Size) {
        super(initialPosition, size)
        const dx = targetPosition.x - initialPosition.x
        const dy = targetPosition.y - initialPosition.y

        if (dx === 0) {
            this.a = 0
            this.b = 0
            this.direction = dy > 0 ? 1 : -1
            this.angle = Math.PI / 2
            this.isVertical = true
        } else {
            this.a = dy / dx
            this.b = targetPosition.y - this.a * targetPosition.x
            this.direction = dx > 0 ? 1 : -1
            this.angle = Math.atan(this.a)
            this.isVertical = false
        }

        this.speed = 4
    }

    public passiveMovement(deltaTime: number) {
        if (this.isVertical) {
            this.currentPosition.y += this.speed * (deltaTime / 16) * this.direction
        } else {
            this.currentPosition.x += this.speed * (deltaTime / 16) * Math.cos(this.angle) * this.direction
            this.currentPosition.y = this.a * this.currentPosition.x + this.b
        }
    }
}

export default PassiveElement