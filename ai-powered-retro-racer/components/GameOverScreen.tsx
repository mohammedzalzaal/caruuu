
import React from 'react';
import { ReplayIcon, MenuIcon } from './icons/Icons';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onPlayAgain, onBackToMenu }) => {
  const isNewHighScore = score > 0 && score === highScore;

  return (
    <div className="text-center bg-black bg-opacity-70 p-8 rounded-lg shadow-2xl backdrop-blur-sm border-2 border-red-500 max-w-md w-full animate-fade-in">
      <h1 className="font-press-start text-5xl text-red-500 drop-shadow-[0_4px_0_#7f1d1d]">
        Game Over
      </h1>

      {isNewHighScore && (
        <p className="mt-6 text-2xl text-yellow-400 font-bold animate-pulse">
          New High Score!
        </p>
      )}

      <div className="mt-6 text-2xl space-y-2">
        <p className="text-gray-300">Your Score: <span className="font-bold text-white">{score}</span></p>
        <p className="text-gray-300">High Score: <span className="font-bold text-white">{highScore}</span></p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button
          onClick={onPlayAgain}
          className="w-full flex items-center justify-center bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-5 rounded-lg text-xl transform hover:scale-105 transition-transform duration-200 ease-in-out shadow-lg border-b-4 border-green-800 hover:border-green-600"
        >
          <ReplayIcon className="w-7 h-7 mr-3" />
          Play Again
        </button>
        <button
          onClick={onBackToMenu}
          className="w-full flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-5 rounded-lg text-xl transform hover:scale-105 transition-transform duration-200 ease-in-out shadow-lg border-b-4 border-gray-800 hover:border-gray-600"
        >
           <MenuIcon className="w-7 h-7 mr-3" />
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
