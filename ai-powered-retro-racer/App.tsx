
import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Theme } from './types';
import MainMenu from './components/MainMenu';
import Game from './components/Game';
import GameOverScreen from './components/GameOverScreen';
import { generateTheme } from './services/geminiService';
import { DEFAULT_THEME, HIGH_SCORE_KEY } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MainMenu);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [isThemeLoading, setIsThemeLoading] = useState(false);
  const [themeError, setThemeError] = useState<string | null>(null);

  // Load high score from local storage on initial mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const handleStartGame = () => {
    setScore(0);
    setGameState(GameState.Playing);
  };

  const handleGameOver = useCallback((finalScore: number) => {
    setHighScore(prevHighScore => {
      if (finalScore > prevHighScore) {
        localStorage.setItem(HIGH_SCORE_KEY, finalScore.toString());
        return finalScore;
      }
      return prevHighScore;
    });
    setScore(finalScore);
    setGameState(GameState.GameOver);
  }, []);

  const handlePlayAgain = () => {
    setScore(0);
    setGameState(GameState.Playing);
  };
  
  const handleBackToMenu = () => {
    setGameState(GameState.MainMenu);
  };

  const handleGenerateTheme = async (prompt: string) => {
    if (!prompt) {
      setThemeError("Please enter a description for the theme.");
      return;
    }
    setIsThemeLoading(true);
    setThemeError(null);
    try {
      const newTheme = await generateTheme(prompt);
      setTheme(newTheme);
    } catch (error) {
      console.error("Failed to generate theme:", error);
      setThemeError("AI failed to generate theme. Please try again.");
    } finally {
      setIsThemeLoading(false);
    }
  };

  // This sets the CSS variables for the dynamic theme
  const themeStyles = {
    '--sky-color': theme.skyColor,
    '--road-color': theme.roadColor,
    '--stripe-color': theme.stripeColor,
    '--grass-color': theme.grassColor,
    '--player-car-color': theme.playerCarColor,
    '--opponent-car-color-1': theme.opponentCarColors[0],
    '--opponent-car-color-2': theme.opponentCarColors[1],
    '--opponent-car-color-3': theme.opponentCarColors[2],
  } as React.CSSProperties;

  return (
    <div style={themeStyles} className="bg-[var(--sky-color)] text-white min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-1000">
      {gameState === GameState.MainMenu && (
        <MainMenu
          onStartGame={handleStartGame}
          onGenerateTheme={handleGenerateTheme}
          isLoading={isThemeLoading}
          error={themeError}
        />
      )}
      {gameState === GameState.Playing && (
        <Game
          onGameOver={handleGameOver}
        />
      )}
      {gameState === GameState.GameOver && (
        <GameOverScreen
          score={score}
          highScore={highScore}
          onPlayAgain={handlePlayAgain}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
};

export default App;
