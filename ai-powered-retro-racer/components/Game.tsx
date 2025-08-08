
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { OpponentCar as OpponentCarType } from '../types';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_CAR_WIDTH,
  PLAYER_CAR_HEIGHT,
  PLAYER_Y_POSITION,
  PLAYER_TURN_SPEED,
  OPPONENT_CAR_WIDTH,
  OPPONENT_CAR_HEIGHT,
  OPPONENT_START_Y,
  BASE_OPPONENT_SPEED,
  SPEED_INCREASE_PER_SECOND,
  OPPONENT_SPAWN_RATE_MS,
  ROAD_STRIPE_HEIGHT,
  ROAD_STRIPE_GAP,
} from '../constants';
import PlayerCar from './PlayerCar';
import OpponentCar from './OpponentCar';

interface GameProps {
  onGameOver: (score: number) => void;
}

// Custom hook for keyboard controls
const useKeyboardControls = () => {
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key] = false; };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
};

const Game: React.FC<GameProps> = ({ onGameOver }) => {
  // Use state only for triggering re-renders, not for game logic state.
  const [, setRenderTrigger] = useState(0);

  // Use refs for all state that changes within the continuous game loop
  const playerPositionRef = useRef(GAME_WIDTH / 2);
  const opponentsRef = useRef<OpponentCarType[]>([]);
  const scoreRef = useRef(0);
  const gameTimeRef = useRef(0);
  const roadOffsetRef = useRef(0);
  
  const keys = useKeyboardControls();
  const gameLoopRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);
  
  const gameLoop = useCallback((currentTime: number) => {
    if (lastFrameTimeRef.current === 0) {
      lastFrameTimeRef.current = currentTime;
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
    lastFrameTimeRef.current = currentTime;
    gameTimeRef.current += deltaTime;

    const currentSpeed = BASE_OPPONENT_SPEED + gameTimeRef.current * SPEED_INCREASE_PER_SECOND;
    
    // Update player position from refs
    if (keys.current['ArrowLeft']) {
      playerPositionRef.current -= PLAYER_TURN_SPEED * deltaTime;
    }
    if (keys.current['ArrowRight']) {
      playerPositionRef.current += PLAYER_TURN_SPEED * deltaTime;
    }
    playerPositionRef.current = Math.max(
      PLAYER_CAR_WIDTH / 2,
      Math.min(GAME_WIDTH - PLAYER_CAR_WIDTH / 2, playerPositionRef.current)
    );
    
    // Update opponents and road refs
    roadOffsetRef.current = (roadOffsetRef.current + currentSpeed * deltaTime) % (ROAD_STRIPE_HEIGHT + ROAD_STRIPE_GAP);
    
    opponentsRef.current = opponentsRef.current
        .map(op => ({ ...op, y: op.y + currentSpeed * deltaTime }))
        .filter(op => op.y < GAME_HEIGHT);
        
    scoreRef.current += currentSpeed * deltaTime / 100;

    // Spawn new opponents
    if (currentTime - lastSpawnTimeRef.current > OPPONENT_SPAWN_RATE_MS) {
      lastSpawnTimeRef.current = currentTime;
      const opponentLanes = [GAME_WIDTH * 0.25, GAME_WIDTH * 0.5, GAME_WIDTH * 0.75];
      const newX = opponentLanes[Math.floor(Math.random() * opponentLanes.length)];
      const carColors = ['var(--opponent-car-color-1)', 'var(--opponent-car-color-2)', 'var(--opponent-car-color-3)'];
      const newColor = carColors[Math.floor(Math.random() * carColors.length)];
      
      opponentsRef.current.push({
        id: currentTime,
        x: newX,
        y: OPPONENT_START_Y,
        color: newColor,
      });
    }

    // Collision detection using up-to-date refs
    for (const opponent of opponentsRef.current) {
      const xCollision = Math.abs(opponent.x - playerPositionRef.current) < (PLAYER_CAR_WIDTH + OPPONENT_CAR_WIDTH) / 2;
      const yCollision = PLAYER_Y_POSITION < opponent.y + OPPONENT_CAR_HEIGHT && PLAYER_Y_POSITION + PLAYER_CAR_HEIGHT > opponent.y;

      if (xCollision && yCollision) {
        onGameOver(Math.floor(scoreRef.current));
        return; 
      }
    }

    // Trigger a re-render to update the UI with the new ref values
    setRenderTrigger(r => r + 1);
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [onGameOver]);

  useEffect(() => {
    // Reset all game state refs when the component mounts/game starts
    playerPositionRef.current = GAME_WIDTH / 2;
    opponentsRef.current = [];
    scoreRef.current = 0;
    gameTimeRef.current = 0;
    roadOffsetRef.current = 0;
    lastFrameTimeRef.current = 0;
    lastSpawnTimeRef.current = 0;

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current !== null) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop]);

  const numStripes = Math.ceil(GAME_HEIGHT / (ROAD_STRIPE_HEIGHT + ROAD_STRIPE_GAP)) + 1;

  return (
    <div className="relative overflow-hidden shadow-2xl border-4 border-black" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        {/* Background Grass */}
        <div className="absolute inset-0 bg-[var(--grass-color)] transition-colors duration-1000"></div>

        {/* Road */}
        <div className="absolute inset-x-0 h-full bg-[var(--road-color)] transition-colors duration-1000" style={{ width: '75%', margin: '0 auto' }}>
            {/* Road Stripes */}
            {Array.from({ length: 2 }).map((_, laneIndex) => (
                <div key={laneIndex} className="absolute h-full" style={{ left: `${(laneIndex + 1) * 33.33}%` }}>
                    {Array.from({ length: numStripes }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 bg-[var(--stripe-color)] transition-colors duration-1000"
                            style={{
                                height: ROAD_STRIPE_HEIGHT,
                                top: (i * (ROAD_STRIPE_HEIGHT + ROAD_STRIPE_GAP)) - roadOffsetRef.current,
                                transform: 'translateX(-50%)',
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>

        {/* HUD (reading from ref) */}
        <div className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded">
            <p className="font-press-start text-lg text-white">
                SCORE: {Math.floor(scoreRef.current)}
            </p>
        </div>

        {/* Game Objects (reading from refs) */}
        <PlayerCar x={playerPositionRef.current} y={PLAYER_Y_POSITION} />
        {opponentsRef.current.map(op => (
            <OpponentCar key={op.id} x={op.x} y={op.y} color={op.color} />
        ))}
    </div>
  );
};

export default Game;
