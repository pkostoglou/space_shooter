import { Application, extend } from "@pixi/react";
import { Container, Sprite, Text } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import Player from "../Elements/Player";
import Projectile from "../Elements/Projectile";
import Meteor from "../Elements/Meteor";
import ScoreModal from "../components/ScoreModal";
import { addScore, getScores } from "../apis";

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Sprite,
  Text
});

export default function Game({
  mode
}:{
  mode: 'single' | 'double'
}) {
  const mouseIsBeingPressed = useRef(false)
  const mainPlayerRef = useRef<Sprite>(null)
  const secondPlayerRef = useRef<Sprite>(null)
  const mousePosition = useRef<{ x: number, y: number }>({ x: 0, y: 0 })
  const [projectiles, setProjectiles] = useState<{ position: { x: number, y: number }, size: { width: number, height: number }, angle: number }[]>([])
  const [meteors, setMeteors] = useState<{ position: { x: number, y: number }, size: { width: number, height: number }, angle: number }[]>([])
  const pressedKeysRef = useRef<{ [k: string]: boolean }>({});
  const wsRef = useRef<WebSocket>(null)
  const [score, setScore] = useState(0)
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false)
  const [playerRotation, setPlayerRotation] = useState(-1*Math.PI)
  const [secondPlayerRotation, setSecondPlayerRotation] = useState(-1*Math.PI)

  const keyDown = (e: KeyboardEvent) => {
    pressedKeysRef.current[e.key] = true
  }

  const keyUp = (e: KeyboardEvent) => {
    pressedKeysRef.current[e.key] = false
  }

  // Add event listeners for movement inputs
  useEffect(() => {
    window.addEventListener("keydown", keyDown)
    window.addEventListener("keyup", keyUp)
    // Clears inputs when the user changes tab or right clicks
    window.addEventListener("blur", clearInputs)
    window.addEventListener("focus", clearInputs)
    window.addEventListener("visibilitychange", clearInputs)
    window.addEventListener("contextmenu", clearInputs)
    return () => {
      window.removeEventListener("keydown", keyDown)
      window.removeEventListener("keyup", keyUp)
      window.removeEventListener("blur", clearInputs)
      window.removeEventListener("focus", clearInputs)
      window.removeEventListener("visibilitychange", clearInputs)
      window.removeEventListener("contextmenu", clearInputs)
    }

  }, [])

  const userMouseDown = () => {
    mouseIsBeingPressed.current = true
  }

  const userMouseUp = () => {
    mouseIsBeingPressed.current = false
  }

  const clearInputs = () => {
    pressedKeysRef.current = {}
    userMouseUp()
  }

  useEffect(() => {
    window.addEventListener("mousedown", userMouseDown)
    window.addEventListener("mouseup", userMouseUp)
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const getMousePosition = (e: MouseEvent) => {
      if (!mousePosition.current) return;

      const rect = canvas.getBoundingClientRect();
      mousePosition.current.x = e.clientX - rect.left;
      mousePosition.current.y = e.clientY - rect.top;
    };

    canvas.addEventListener("mousemove", getMousePosition);

    const wsUrl = import.meta.env.VITE_WS_BASE_URL ?? 'ws://localhost:8000'
    const ws = new WebSocket(`${wsUrl}?mode=single`);

    ws.onopen = () => {
      console.log('Connected to server');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (!mainPlayerRef.current) return
      if (data.player) {
        mainPlayerRef.current?.position.set(data.player[0].position.x, data.player[0].position.y)
        if(data.player.length>1) {
          secondPlayerRef.current?.position.set(data.player[1].position.x, data.player[1].position.y)
          setSecondPlayerRotation(data.player[1].angle)
        }
        setPlayerRotation(data.player[0].angle)
      }
      if (data.projectiles) {
        const newProjectiles = data.projectiles.map((projectile: any) => {
          return {
            position: projectile.currentPosition,
            size: projectile.size,
            angle: projectile.direction > 0 ? projectile.angle + Math.PI / 2 : projectile.angle + Math.PI / 2 + Math.PI
          }
        })
        setProjectiles(newProjectiles)
      }
      if (data.meteors) {
        const newMeteors = data.meteors.map((meteor: any) => {
          return {
            position: meteor.currentPosition,
            angle: meteor.objectAngle,
            size: meteor.size
          }
        })
        setMeteors(newMeteors)
      }
      if (data.score) {
        setScore(data.score)
      }
      if (data.isGameActive == false) {
        setIsScoreModalOpen(true)
      }
    };

    wsRef.current = ws
    getScores()
    return () => {
      window.removeEventListener("mousedown", userMouseDown)
      window.removeEventListener("mouseup", userMouseUp)
      canvas.addEventListener("mousemove", getMousePosition);
    }
  }, [])

  useEffect(() => {
    const inputInterval = setInterval(() => {
      if (wsRef) {
        const movement = {
          vertical: 0,
          horizontal: 0
        }
        const targetPosition = { targetPositionX: mousePosition.current.x, targetPositionY: mousePosition.current.y }
        if (pressedKeysRef.current.w) {
          movement.vertical--
        }
        if (pressedKeysRef.current.d) {
          movement.horizontal++
        }
        if (pressedKeysRef.current.s) {
          movement.vertical++
        }
        if (pressedKeysRef.current.a) {
          movement.horizontal--
        }

        wsRef.current?.send(JSON.stringify({
          playerMovement: movement,
          targetPosition: targetPosition,
          mouseIsBeingPressed: mouseIsBeingPressed.current
        }))
      }
    }, 5)

    return () => clearInterval(inputInterval)
  }, [])

  return (
    <><Application background={"#1099bb"} width={1400} height={900}>
      <Player spriteRef={mainPlayerRef} angle={playerRotation}/>
      {mode=='double' && <Player spriteRef={secondPlayerRef} angle={secondPlayerRotation}/>}
      <pixiContainer>
        <pixiText
          text={`Score ${score}`}
          x={100}
          y={10}
          style={{ fontSize: 24, fill: 0xffffff }}
        />
      </pixiContainer>
      {
        projectiles.length > 0 && projectiles.map((projectile, index) => {
          return <Projectile
            currentPositionX={projectile.position.x}
            currentPositionY={projectile.position.y}
            angle={projectile.angle}
            key={index}
          />
        })
      }
      {
        meteors.length > 0 && meteors.map((meteor, index) => {
          return <Meteor
            currentPositionX={meteor.position.x}
            currentPositionY={meteor.position.y}
            angle={meteor.angle}
            size={meteor.size}
            key={index}
          />
        })
      }
    </Application>
      <ScoreModal
        isOpen={isScoreModalOpen}
        score={score}
        onSave={async(name: string) =>{ return await addScore(score, name)}}
        onRestart={() => { wsRef.current?.send(JSON.stringify({ type: "restart" })); setIsScoreModalOpen(false); setScore(0) }}
      />
    </>
  );
}
