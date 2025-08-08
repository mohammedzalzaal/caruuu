
import React from 'react';
import { PLAYER_CAR_WIDTH, PLAYER_CAR_HEIGHT } from '../constants';

interface PlayerCarProps {
  x: number;
  y: number;
}

const PlayerCar: React.FC<PlayerCarProps> = ({ x, y }) => {
  return (
    <div
      style={{
        width: PLAYER_CAR_WIDTH,
        height: PLAYER_CAR_HEIGHT,
        position: 'absolute',
        top: y,
        left: x,
        transform: 'translateX(-50%)',
        transition: 'background-color 0.5s ease',
        backgroundColor: 'var(--player-car-color)',
        borderRadius: '8px 8px 4px 4px',
        border: '2px solid black',
        boxShadow: 'inset 0 -10px rgba(0,0,0,0.2)',
      }}
    >
      {/* Windshield */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '10%',
        width: '80%',
        height: '30%',
        backgroundColor: '#a0deff',
        borderRadius: '6px 6px 2px 2px',
        border: '2px solid black',
      }}></div>
       {/* Headlights */}
      <div style={{
        position: 'absolute',
        bottom: '5%',
        left: '10%',
        width: '20%',
        height: '10%',
        backgroundColor: '#f7ff82',
        borderRadius: '50%',
        border: '1px solid black'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '5%',
        right: '10%',
        width: '20%',
        height: '10%',
        backgroundColor: '#f7ff82',
        borderRadius: '50%',
        border: '1px solid black'
      }}></div>
    </div>
  );
};

export default PlayerCar;
