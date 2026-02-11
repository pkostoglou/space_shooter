import { extend, useTick } from "@pixi/react";
import { Assets, Sprite, Texture } from "pixi.js";
import { RefObject, useEffect, useState } from "react";
import { JSX } from "react";

// extend tells @pixi/react what Pixi.js components are available
extend({
  Sprite,
});


const Player = ({
  spriteRef,
  angle
}: {
  spriteRef: RefObject<Sprite | null>
  angle: number
}):JSX.Element => {
  // The Pixi.js `Sprite`
  const [texture, setTexture] = useState(Texture.EMPTY);

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

export default Player
