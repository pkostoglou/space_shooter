import type { Position, Size } from "../../domains/gameTypes.js";
import Element from "./Element.js";

class PassiveElement extends Element {
    protected a: number
    protected b: number
    protected direction: number
    protected angle: number
    protected speed: number

    constructor(initialPosition: Position, targetPosition: Position, size: Size) {
        super(initialPosition, size)
        const a = (targetPosition.y - initialPosition.y) / (targetPosition.x - initialPosition.x)
        const b = targetPosition.y - a * targetPosition.x

        const direction = targetPosition.x > initialPosition.x ? 1 : -1
        const angle = Math.atan(a)

        this.a = a
        this.b = b
        this.direction = direction
        this.angle = angle
        this.speed = 4
    }

    public passiveMovement(deltaTime: number) {
        this.currentPosition.x += this.speed * (deltaTime / 16) * Math.cos(this.angle) * this.direction
        this.currentPosition.y = this.a * this.currentPosition.x + this.b
    }
}

export default PassiveElement