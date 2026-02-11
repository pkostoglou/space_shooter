import type { Position, Size } from "../../domains/gameTypes.js";

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

    public detectCollisionWithElement<T extends Element>(otherElement: T): boolean {

        const otherElementPosition = otherElement.getPosition()
        const otherElementSize = otherElement.getSize()

        return (
            (
                this.currentPosition.x >= otherElementPosition.x - 40 && this.currentPosition.x <= otherElementPosition.x + 40
            ) &&
            (
                this.currentPosition.y >= otherElementPosition.y - 40 && this.currentPosition.y <= otherElementPosition.y + 40
            )
        )
        // return (
        //     (
        //         (this.currentPosition.x + this.size.width/2 >= otherElementPosition.x - otherElementSize.width/2 && this.currentPosition.x + this.size.width/2 <= otherElementPosition.x + otherElementSize.width/2) ||
        //         (this.currentPosition.x - this.size.width/2 >= otherElementPosition.x - otherElementSize.width/2 && this.currentPosition.x - this.size.width/2 <= otherElementPosition.x + otherElementSize.width/2)
        //     ) &&
        //     (
        //         (this.currentPosition.y + this.size.height/2 >= otherElementPosition.y - otherElementSize.height/2 && this.currentPosition.y + this.size.height/2 <= otherElementPosition.y + otherElementSize.height/2) ||
        //         (this.currentPosition.y - this.size.height/2 >= otherElementPosition.y - otherElementSize.height/2 && this.currentPosition.y - this.size.height/2 <= otherElementPosition.y + otherElementSize.height/2)
        //     )
        // )
    }
}

export default Element