import type { Position } from "../../domains/gameTypes.js"
import PassiveElement from "./PassiveElement.ts"

class Projectile extends PassiveElement {
    private sourceId: number

    constructor(sourceId: number, initialPosition: Position, targetPosition: Position) {
        super(initialPosition, targetPosition, {width:50, height:20})
        this.sourceId = sourceId
    }
}

export default Projectile