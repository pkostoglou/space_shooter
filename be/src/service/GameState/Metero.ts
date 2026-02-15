import PassiveElement from "./PassiveElement.js";
import type { Position } from "../../domains/gameTypes.js";

class Meteor extends PassiveElement{
    private objectAngle:number

    constructor(initialPosition: Position, targetPosition: Position, speed:number) {
        super(initialPosition, targetPosition, {width: 100, height:100})
        this.speed = speed
        this.objectAngle = 45
    }

    public passiveMovement(deltaTime: number): void {
        super.passiveMovement(deltaTime)
        this.objectAngle += 1
    }
}

export default Meteor