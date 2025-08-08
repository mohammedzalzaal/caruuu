
import { Theme } from './types';

export const HIGH_SCORE_KEY = 'retroRacerHighScore';

// Game Dimensions (using tailwind screen sizes for consistency)
// The game board will be w-[384px] h-[640px] which is sm:
export const GAME_WIDTH = 384;
export const GAME_HEIGHT = 640;

// Player Car
export const PLAYER_CAR_WIDTH = 40;
export const PLAYER_CAR_HEIGHT = 80;
export const PLAYER_Y_POSITION = GAME_HEIGHT - PLAYER_CAR_HEIGHT - 20;
export const PLAYER_TURN_SPEED = 300; // pixels per second

// Opponent Cars
export const OPPONENT_CAR_WIDTH = 40;
export const OPPONENT_CAR_HEIGHT = 80;
export const OPPONENT_START_Y = -OPPONENT_CAR_HEIGHT;
export const BASE_OPPONENT_SPEED = 150; // pixels per second
export const SPEED_INCREASE_PER_SECOND = 2;
export const OPPONENT_SPAWN_RATE_MS = 1200; // ms

// Road
export const ROAD_STRIPE_WIDTH = 10;
export const ROAD_STRIPE_HEIGHT = 40;
export const ROAD_STRIPE_GAP = 20;

export const DEFAULT_THEME: Theme = {
  skyColor: '#1a202c', // gray-900
  roadColor: '#4a5568', // gray-700
  stripeColor: '#f7fafc', // gray-100
  grassColor: '#2f855a', // green-700
  playerCarColor: '#e53e3e', // red-600
  opponentCarColors: ['#3182ce', '#dd6b20', '#38a169'], // blue-600, orange-600, green-500
};
