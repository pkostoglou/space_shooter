import type { Position, Size } from "../../domains/gameTypes.js";
import { checkShapeCollision } from "./helpers/CollisionShapes.js"
import type { CollisionShape } from "./helpers/CollisionShapes.js"

class Element {
    protected currentPosition: Position
    protected size: Size

    constructor(initialPosition: Position, size: Size) {
        this.currentPosition = {
            x: initialPosition.x,
            y: initialPosition.y
        }
        this.size = size
    }

    public isOutOfBound() {
        return this.currentPosition.x >= 2500 || this.currentPosition.x <= -10 || this.currentPosition.y > 2500 || this.currentPosition.y <= -10
    }

    public getPosition(): Position {
        return this.currentPosition
    }

    public getSize(): Size {
        return this.size
    }

    public getCollisionShape(): CollisionShape {
        return {
            type: 'rectangle',
            position: this.currentPosition,
            size: this.size,
            angle: 0
        }
    }

    public detectCollisionWithElement<T extends Element>(otherElement: T): boolean {
        return checkShapeCollision(
            this.getCollisionShape(),
            otherElement.getCollisionShape()
        )
    }
}

export default Element