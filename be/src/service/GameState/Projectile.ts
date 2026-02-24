import type { Position } from "../../domains/gameTypes.js"
import PassiveElement from "./PassiveElement.js"

class Projectile extends PassiveElement {
    private sourceId: number

    constructor(sourceId: number, initialPosition: Position, targetPosition: Position) {
        super(initialPosition, targetPosition, {width:40, height:25})
        this.sourceId = sourceId
    }
}

export default Projectile