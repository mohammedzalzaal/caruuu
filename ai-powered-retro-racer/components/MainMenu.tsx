
import React, { useState } from 'react';
import { SparklesIcon, PlayIcon } from './icons/Icons';

interface MainMenuProps {
  onStartGame: () => void;
  onGenerateTheme: (prompt: string) => void;
  isLoading: boolean;
  error: string | null;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onGenerateTheme, isLoading, error }) => {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="text-center bg-black bg-opacity-50 p-8 rounded-lg shadow-2xl backdrop-blur-sm border-2 border-gray-500 max-w-lg w-full">
      <h1 className="font-press-start text-4xl md:text-5xl text-yellow-400 drop-shadow-[0_4px_0_#c00]">
        AI Racer
      </h1>
      <p className="mt-4 text-lg text-gray-200">
        Dodge traffic and survive as long as you can!
      </p>
      <p className="mt-2 text-sm text-gray-400">
        Use Left/Right arrow keys to move.
      </p>

      <div className="mt-8">
        <button
          onClick={onStartGame}
          className="w-full flex items-center justify-center bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-lg text-2xl transform hover:scale-105 transition-transform duration-200 ease-in-out shadow-lg border-b-4 border-green-800 hover:border-green-600"
        >
          <PlayIcon className="w-8 h-8 mr-3" />
          Start Race
        </button>
      </div>

      <div className="mt-8 pt-6 border-t-2 border-gray-600">
        <h2 className="text-xl font-bold text-cyan-400">Customize Your Ride</h2>
        <p className="mt-2 text-gray-300">Describe a theme and let AI create it!</p>
        <p className="mt-1 text-xs text-gray-500">e.g., "vaporwave sunset", "deep sea race", "haunted forest"</p>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter theme description..."
            className="flex-grow bg-gray-800 text-white border-2 border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            disabled={isLoading}
          />
          <button
            onClick={() => onGenerateTheme(prompt)}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-5 rounded-md transform hover:scale-105 transition-transform duration-200 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed shadow-lg border-b-4 border-cyan-800 hover:border-cyan-600"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              <>
                <SparklesIcon className="w-6 h-6 mr-2" />
                Generate
              </>
            )}
          </button>
        </div>
        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default MainMenu;
