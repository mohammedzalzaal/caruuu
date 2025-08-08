
import React from 'react';
import { OPPONENT_CAR_WIDTH, OPPONENT_CAR_HEIGHT } from '../constants';

interface OpponentCarProps {
  x: number;
  y: number;
  color: string;
}

const OpponentCar: React.FC<OpponentCarProps> = ({ x, y, color }) => {
  return (
    <div
      style={{
        width: OPPONENT_CAR_WIDTH,
        height: OPPONENT_CAR_HEIGHT,
        position: 'absolute',
        top: y,
        left: x,
        transform: 'translateX(-50%)',
        backgroundColor: color,
        borderRadius: '8px 8px 4px 4px',
        border: '2px solid black',
        boxShadow: 'inset 0 10px rgba(0,0,0,0.2)',
      }}
    >
        {/* Windshield */}
        <div style={{
            position: 'absolute',
            bottom: '15%',
            left: '10%',
            width: '80%',
            height: '30%',
            backgroundColor: '#666',
            borderRadius: '2px 2px 6px 6px',
            border: '2px solid black',
        }}></div>
    </div>
  );
};

export default OpponentCar;
