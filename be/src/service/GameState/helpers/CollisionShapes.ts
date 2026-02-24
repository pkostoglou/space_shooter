import type { Position, Size } from "../../../domains/gameTypes.js"

type RectangleShape = {
    type: 'rectangle'
    position: Position
    size: Size
    angle: number
}

type CollisionShape = RectangleShape

type Vec2 = { x: number, y: number }

function getRectangleCorners(shape: RectangleShape): [Vec2, Vec2, Vec2, Vec2] {
    const { position, size, angle } = shape
    const hw = size.width / 2
    const hh = size.height / 2
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)

    return [
        { x: position.x - hw * cos + hh * sin, y: position.y - hw * sin - hh * cos },
        { x: position.x + hw * cos + hh * sin, y: position.y + hw * sin - hh * cos },
        { x: position.x + hw * cos - hh * sin, y: position.y + hw * sin + hh * cos },
        { x: position.x - hw * cos - hh * sin, y: position.y - hw * sin + hh * cos },
    ]
}

function projectOntoAxis(corners: Vec2[], axis: Vec2): { min: number, max: number } {
    let min = Infinity
    let max = -Infinity
    for (const corner of corners) {
        const projection = corner.x * axis.x + corner.y * axis.y
        if (projection < min) min = projection
        if (projection > max) max = projection
    }
    return { min, max }
}

function checkRectangleVsRectangle(a: RectangleShape, b: RectangleShape): boolean {
    const cornersA = getRectangleCorners(a)
    const cornersB = getRectangleCorners(b)

    // 4 separating axes: 2 edge normals per rectangle
    const axes: Vec2[] = []
    for (const corners of [cornersA, cornersB]) {
        const edge1 = { x: corners[1].x - corners[0].x, y: corners[1].y - corners[0].y }
        const edge2 = { x: corners[3].x - corners[0].x, y: corners[3].y - corners[0].y }
        axes.push({ x: -edge1.y, y: edge1.x })
        axes.push({ x: -edge2.y, y: edge2.x })
    }

    for (const axis of axes) {
        const projA = projectOntoAxis(cornersA, axis)
        const projB = projectOntoAxis(cornersB, axis)
        if (projA.max <= projB.min || projB.max <= projA.min) {
            return false
        }
    }

    return true
}

function checkShapeCollision(a: CollisionShape, b: CollisionShape): boolean {
    if (a.type === 'rectangle' && b.type === 'rectangle') {
        return checkRectangleVsRectangle(a, b)
    }
    return false
}

export { checkShapeCollision }
export type { CollisionShape, RectangleShape }
