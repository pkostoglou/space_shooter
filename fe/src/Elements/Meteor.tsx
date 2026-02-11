import { extend, useTick } from "@pixi/react";
import { Assets, Sprite, Texture } from "pixi.js";
import { useRef, useEffect, useState } from "react";
import { JSX } from "react";

extend({
  Sprite,
});

const Meteor = ({
  currentPositionX,
  currentPositionY,
  angle,
  size
}: {
  currentPositionX: number,
  currentPositionY: number,
  angle: number,
  size: {
    width: number,
    height: number
  }
}): JSX.Element => {
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
    spriteRef.current.angle = angle
    spriteRef.current.width = size.width
    spriteRef.current.height = size.height
  });

  return (
    <pixiSprite
      ref={spriteRef}
      texture={texture}
      anchor={0.5}
    />
  );
};

export default Meteor