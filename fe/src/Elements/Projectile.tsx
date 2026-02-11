import { extend, useTick } from "@pixi/react";
import { Assets, Sprite, Texture } from "pixi.js";
import { useRef, useEffect, useState } from "react";
import { JSX } from "react";

extend({
  Sprite,
});


const Projectile = ({
    currentPositionX,
    currentPositionY,
    angle
}: {
    currentPositionX: number,
    currentPositionY: number,
    angle: number
}): JSX.Element => {
    // The Pixi.js `Sprite`
    const [texture, setTexture] = useState(Texture.EMPTY);
    const spriteRef = useRef<Sprite>(null)

    // Preload the sprite if it hasn't been loaded yet
    useEffect(() => {
        if (texture === Texture.EMPTY) {
            Assets.load("/assets/bunny.png").then((result) => {
                setTexture(result);
            });
        }
    }, [texture]);

    // Listen for animate update
    useTick(() => {
        if (!spriteRef.current) return;
        spriteRef.current.position.set(currentPositionX, currentPositionY)
        // spriteRef.current.angle = angle
    });

    return (
        <pixiSprite
            ref={spriteRef}
            texture={texture}
            anchor={0.5}
            rotation={angle}
        />
    );
};

export default Projectile